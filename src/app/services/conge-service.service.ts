import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../pages/REST_URL";

const baseUrl = REST_URL+'/conges';


@Injectable({
  providedIn: 'root'
})
export class CongeService {

  constructor(private httpClient: HttpClient) { }

  public create(data) {
    return this.httpClient.post(baseUrl, data);
  }

  public update(id:number,data) {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }

  public getAllCongesByUserId(id:number) {
    return this.httpClient.get(`${baseUrl}/users/${id}`);
  }

  public getAllCongesByStructureId(id:number) {
    return this.httpClient.get(`${baseUrl}/structure/${id}`);
  }
  public traitement(id:number,data:string) {
    return this.httpClient.put(`${baseUrl}/traitement/${id}`, {'statut':data});
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
}
