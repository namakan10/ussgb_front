import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../../REST_URL";
import {Files} from "./files.model";

const baseUrl = REST_URL+'/files';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private httpClient: HttpClient) { }

  public create(data) {
    return this.httpClient.post(baseUrl, data);
  }

  public update(id:number,data) {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }


  public onUpload(file:File) {

    const formData = new FormData();
    const currentDate = new Date();

    formData.append('file', file);
    formData.append('annee_scolaire', (currentDate.getFullYear() - 1) + "-" + currentDate.getFullYear());
    formData.append('file_type', "COURRIER");
    formData.append('fileType', "COURRIER");
    // formData.append('file_owner', "COURRIER");
    // formData.append('owner_id', `${id}`);
    console.log("DATA UPLOAD", formData);
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post(`${baseUrl}`, formData);
  }



  public uploadPromise(file:File) {
    let promise = new Promise((resolve, reject) => {
      this.onUpload(file)
        .subscribe(
          (response:Files) => {
            reject(response)
          },error => {
            console.log('upload error', error);
            resolve(error.error.text);
          }
        );
    });
    return promise;
  }



  public uploadPromises(files:File[]) {
    const values: Files[] = [];
    let promise = new Promise((resolve, reject) => {
      files.forEach((file) => {
        this.onUpload(file)
          .subscribe((response:Files) => {
              values.push(response);
              console.log("### UPLOAD DATA ", response)
              if(values.length==files.length){
                console.log("### UPLOAD DATAS ", values)
                reject(values)
              }
            },error => {
             resolve(error);
             console.log("### Error uploadPromisess ###",error);
            }
          );
      });

    });
    return promise;

  }


  public uploadPromisess(files:File[]) {
    let promises = files.map(file => this.uploadPromise(file));
    return  Promise.all([promises]);
  }


}
