import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { DataSource } from '../models/datasource';
// import { throwError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatasourceService {
  baseUrl = 'http://localhost:8181';
  datasources: DataSource[];

  constructor(private _http: Http) { }

  getDataSources() {
    const interim = this._http.get(this.baseUrl + '/api/v1/dataSource/getAllSources')
      .pipe(map((response: Response) => response.json()), catchError(this._errorHandler));
      console.log('After calling getDataSources interim' + interim);
      console.log('After calling getDataSources response.JSON ' + Response.toString);
      return interim;
  }


  getDataSourceTypes() {
    const interim = this._http.get(this.baseUrl + '/getDataSourceTypes')
      .pipe(map((response: Response) => response.json()), catchError(this._errorHandler));
      return interim;
  }

  getDatasourceById(id) {
    console.log('calling get DatasourcebyId + id =' + id);
    const newLocal = this._http.get(this.baseUrl + '/api/v1/dataSource/getDataSourceById?id=' + id)
      .pipe(map((response: Response) => response.json()), catchError(this._errorHandler));
    console.log('After calling DatasourcebyId');
    return newLocal;
  }

  saveDataSource(property) {
    console.log('calling saveDataSource + property =' + property.name);
    const result =  this._http.post(this.baseUrl + '/api/v1/dataSource/saveDataSource', property)
      .pipe(map((response: Response) => response.json())
      , catchError(this._errorHandler));
      return result;
  }

  testConnection(property) {
    const result =  this._http.post(this.baseUrl + '/api/v1/dataSource/testConnection', property)
      .pipe(map((response: Response) => response.json())
      , catchError(this._errorHandler));
      return result;
  }

  deleteDatasource(id) {
    const result = this._http.delete(this.baseUrl + '/api/v1/dataSource/deleteDataSource/' + id)
      .pipe(map((response: Response) => response.json())
      , catchError(this._errorHandler));
      return result;
  }

  _errorHandler(error: Response) {
    // debugger;
    console.log(error);
    return Observable.throw(error || 'Internal server error');
  }

}
