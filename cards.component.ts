import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { DatasourceService } from '../../services/datasource.service';
import { DataSource } from '../../models/datasource';
import { ActivatedRoute } from '@angular/router';

declare var swal: any;

@Component({
  templateUrl: 'cards.component.html'
})

export class CardsComponent implements OnInit {

  errorMessage: any;
  databaseTypes: any[];
  propertyForm: FormGroup;
  name: string;
  url: string;
  user: string;
  pwd: string;
  type: string;
  port: string;
  title = 'Add';
  currentId: any;

  constructor(private _fb: FormBuilder, private _activatedRoute: ActivatedRoute,
    private dsService: DatasourceService) {

      if (this._activatedRoute.snapshot.params['id']) {
        this.currentId = this._activatedRoute.snapshot.params['id'];
        console.log(this.currentId);
        this.title = 'Edit';
      }

    }

  getDataSourceTypes() {
    this.dsService.getDataSourceTypes().subscribe(
    data => {
      // this.datasources.push( data);
      // this.datasources: any = data;
      this.databaseTypes = data;
      // this.datasources = Array.of(this.datasources);
      console.log('Calling getdatasourcetypes' + data);
     },
    error => this.errorMessage = error
);
}

ngOnInit() {

  this.getDataSourceTypes();

  if (this.currentId != null) {
    console.log('Calling getDatasourceById');
    this.dsService.getDatasourceById(this.currentId)
        .subscribe(
          resp => {
            console.log('resp.name' + resp.user);
            this.name = resp.name;
            this.url = resp.url;
            this.port = resp.defaultPort;
            this.user = resp.username;
            this.pwd = resp.password;
            this.type = resp.dataSourceType;
        }, error => this.errorMessage = error);
    }

    console.log('After Calling getDatasourceById');
}

  showFailureAlert(param: string) {
    swal({
      title: 'Error',
      text: 'You have errors : ' + param + '!',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'OK'
    });
  }
  showConnectionSuccessAlert(param: DataSource) {
    swal({
      title: 'Success',
      text: 'Connection Success! Do You Want to save the DB Connection?',
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    })
    .then((result) => {
      console.log('result.value: [' + result.value + ']');
      if (!result.value) {
        this.dsService.saveDataSource(param).subscribe(
          data => {
            result = JSON.stringify(data);
            console.log('Calling saveDatasource Failure = [' + data.failure + ']');
            console.log('Calling saveDatasource SUCCESS = [' + data.success + ']');
            if (data.failure != null) {
              this.showFailureAlert(data.failure);
            } else {
              this.showSuccessAlert('Connection Saved Successfully!');
            }
          },
            error => this.errorMessage = error
        );

        swal(
        'Saved!',
        'Your Connection has been saved.',
        'success'
      );
      } else {
        swal('Your Connection is Not Saved!');
      }
    });
  }

  showSuccessAlert(param: any) {
    swal({
      title: 'Success',
      text: param,
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
  }

  showAlert(param: string) {
    swal({
      title: 'Error',
      text: 'Please Enter a valid ' + param + '!',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'OK'
    });
  }

  showConnectionAlert(param: string) {
    swal({
      title: 'Connection failed !',
      text: 'You have errors : ' + param + '!',
      type: 'error',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'OK'
    });
  }

  save() {
    if (!(this.name != null && this.name !== '')) {
      alert('name= ' + this.name);
      this.showAlert('Name');
    } else if (!(this.type != null && this.type !== '')) {
      alert('type= ' + this.pwd);
      this.showAlert('Type');
    } else if (!(this.url != null && this.url !== '')) {
      alert('url= ' + this.url);
      this.showAlert('URL');
    } else if (!(this.user != null && this.user !== '')) {
      alert('user= ' + this.user);
      this.showAlert('User Name');
    } else if (!(this.pwd != null && this.pwd !== '')) {
      alert('name= ' + this.pwd);
      this.showAlert('Password');
    }
    console.log('Values from html: [' + this.type + ']');
    // const dataSource: DataSource;
    let dataSource = {} as DataSource;

    dataSource.name = this.name;
    dataSource.url = this.url;
    dataSource.defaultPort = this.port;
    dataSource.username = this.user;
    dataSource.password = this.pwd;
    dataSource.dataSourceType = this.type;
    console.log('dataSource.type: [' + dataSource.dataSourceType + ']');
    let result: string;
    let message: string;
    let isSuccess: boolean;
    this.dsService.testConnection(dataSource).subscribe(
      data => {
        result = JSON.stringify(data);
        console.log('Calling saveDatasource Failure = [' + data.failure + ']');
        console.log('Calling saveDatasource SUCCESS = [' + data.success + ']');
        if (data.failure != null) {
          isSuccess = false;
          this.showFailureAlert(data.failure);
        } else {
          this.showConnectionSuccessAlert(dataSource);
          isSuccess = true;
        }
        message = data.failure;

       },
      error => this.errorMessage = error
  );
  if (isSuccess) {
    console.log('Success');
  } else {
    console.log('Failure');
  }

  }

}
