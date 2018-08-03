import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtractionService } from '../../services/extraction.service';
import { DatasourceService } from '../../services/datasource.service';

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
  selectedAll: any;

  constructor(private extractionService: ExtractionService, private dsService: DatasourceService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.dataSource1_isChosen = false;
    console.log('Inside Create Extraction' );
    this.getDataSources();
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
    this.selectedAll = this.tables1Columns.every(function(item: any) {
        return item.selected === true;
      });
  }

}
