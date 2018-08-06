import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtractionService } from '../../services/extraction.service';
import { DatasourceService } from '../../services/datasource.service';
import { TreeviewModule } from 'ngx-treeview';

@Component({
  templateUrl: './createextraction.component.html'
})
export class CreateExtractionComponent implements OnInit {

  connections: Array<any> = [];
  baseUrl = 'http://localhost:8181';
  errorMessage: any;
  settings = {};
  dataSource1_isChosen: boolean;
  tables1: any;
  tables1Columns: any;
  dataSource: any;
  checkBoxModel: any;
  selectedAll: any;
  tables1SelectedColumns =  [];
  selectedItems: any = [];

  constructor(private extractionService: ExtractionService, private dsService: DatasourceService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }


    @Output('onSelect')
    onSelect: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.dataSource1_isChosen = false;
    console.log('Inside Create Extraction' );
    this.getDataSources();
    // this.checkBoxModel = true;
  }

  getDataSources() {
    this.dsService.getDataSources().subscribe(
        data => {
          this.connections = data;
          console.log('Inside Create Extraction getDataSources' + data);
         },
        error => this.errorMessage = error
    );
  }

  getTables(conName) {
    console.log('Before Calling getTables' + conName);
    this.extractionService.getDataTables(conName).subscribe(
        data => {
          this.tables1 = data;
          console.log('Inside Create Extraction getTables' + JSON.stringify(data));
         },
        error => this.errorMessage = error
    );
  }

  getTableCoumns(dsName, tableName) {
    console.log('Before Calling getTableCoumns' + tableName);
    this.extractionService.getTableCoumns(dsName, tableName).subscribe(
        data => {
          this.tables1Columns = data;
          console.log('Inside Create Extraction getTableCoumns' + data);
         },
        error => this.errorMessage = error
    );
  }

  onSrcConnChange(event) {
    this.dataSource = event.target.value;
    console.log(this.dataSource);
    if (this.dataSource !== null && this.dataSource !== 'default') {
      this.dataSource1_isChosen = true;
      this.getTables(this.dataSource);
    } else {
      this.dataSource1_isChosen = false;
    }
    console.log('Inside onSrcConnChange' + JSON.stringify(this.dataSource));
  }

  onSrcTableChange(event) {
    const dataTable = event.target.value;
    console.log(dataTable);
    if (dataTable !== null && dataTable !== 'default') {
      this.dataSource1_isChosen = true;
      this.getTableCoumns(this.dataSource, dataTable);
    } else {
      this.dataSource1_isChosen = false;
    }
    console.log('Inside onSrcTableChange' + dataTable);
  }

  onDestConnChange() {
    console.log('Inside onDestConnChange');
  }

  selectAll() {
    for (let i = 0; i < this.tables1Columns.length; i++) {
      this.tables1Columns[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    // let selectedColumns: Array<any> = [];
    this.selectedAll = this.tables1Columns.every(function(item: any) {
      // console.log('Selected columns = ' + item.name);
      // this.tables1SelectedColumns.push(item.name);
      // this.populateSelectedItems(item.selected);
        return item.selected === true;
      });
      // this.tables1SelectedColumns = selectedColumns;
      // console.log('Selected columns = ' + selectedColumns.toString);
  }

  populateSelectedItems(column) {

    const index = this.tables1Columns.indexOf(column.name);
    // if (event.target.checked) {
        if (index === -1) {
            this.selectedItems.push(column.name);
        // }
    } else {
        if (index !== -1) {
            this.selectedItems.splice(index, 1);
        }
    }
    // console.log(this.selectedItems);
  }

  /*onItemSelect(item: any) {

    const index = this.tables1Columns.indexOf(item.name);
    if (index === -1) {
      this.selectedItems.push(item.name);

    } else  if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
    // console.log(this.selectedItems);

    console.log(item.name);
    // this.selectedItems.push(item.name);
    console.log(this.selectedItems);
  }*/
  onItemSelect(index, event) {
    let selectedColumns: Array<any> = [];
    // selectedColumns[index].value = event.target.checked;
    console.log(index + ' ---- ' + event);
    console.log('Column name is = ' + this.tables1Columns[index].name );
    if (event === true) {
      this.selectedItems.push(this.tables1Columns[index].name);
    } else {
      console.log('Removing Column name is = ' + this.tables1Columns[index].name );
      this.selectedItems.splice(this.tables1Columns[index].name, 1);
    }
    /*this.tables1Columns.every(
      function (item: any) {
        console.log('Selected Col Name= ' + item.name);
        console.log('Is Selected = ' + item.selected);
        if (item.selected === true) {
        console.log('Selected columns = ' + item.name);
        selectedColumns.push(item.name);
      }
    });*/
    console.log(this.selectedItems);
  }

}
