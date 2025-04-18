import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../../REST_URL";

const baseUrl = REST_URL+'/conges';

@Injectable({
  providedIn: 'root'
})
export class CongePermissionService {
  constructor(private httpClient: HttpClient) { }

  public create(data) {
    return this.httpClient.post(baseUrl, data);
  }

  public update(id:number,data) {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }


  public findAll(id:number,page?: number, size?: number) {
    page = page === undefined ? 0 : page;
    size = size === undefined ? 50 : size;
    return this.httpClient.get(`${baseUrl}?id_structure=${id}&page=${page}&size=${size}`);
  }

  public findAllBy(idStructure:number,type:string,statut:string,page?, size?) {
    page = page === undefined ? 0 : page;
    size = size === undefined ? 50 : size;

    if(type && statut) {
        return this.httpClient.get(`${baseUrl}?id_structure=${idStructure}&type=${type}&statut=${statut}&page=${page}&size=${size}`);
    }
    if(!type){
      return this.httpClient.get(`${baseUrl}?id_structure=${idStructure}&statut=${statut}&page=${page}&size=${size}`);
    }

    if(!statut){
      return this.httpClient.get(`${baseUrl}?id_structure=${idStructure}&type=${type}&page=${page}&size=${size}`);
    }

  }



  public getAllCongesByUserId(id:number) {
    return this.httpClient.get(`${baseUrl}/users/${id}`);
  }


  public getAllCongesByStructureId(id:number) {
    return this.httpClient.get(`${baseUrl}/structure/${id}`);
  }
  public traitementCP(id:number,data) {
    console.log('statut', data);
    return this.httpClient.put(`${baseUrl}/${id}/traitement`, data);
  }

  public traitement(id:number,data:string) {
    console.log('statut', data);
    return this.httpClient.put(`${baseUrl}/traitement/${id}`, {'statut':data});
  }

  public getPersonnelsd(id:number) {
    return this.httpClient.get(`${REST_URL}/personnels`);
  }

  public getUsersByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/personnelsAdministratif/structure/${id}`);
  }

  public getAllTypeConge() {
    return this.httpClient.get(REST_URL+'/typeConge');
  }

  public delete(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  public onUpload(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post(`${REST_URL}/files/${file.name}`, formData);
  }

  public onUpload2(file:File) {
    const formData = new FormData();

    formData.append('file', file);
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post(`${REST_URL}/files/simpleUpload/${file.name}`, formData);
  }

}
