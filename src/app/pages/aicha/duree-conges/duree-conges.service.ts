import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../../REST_URL";

const baseUrl = REST_URL+'/dureeConges';

@Injectable({
  providedIn: 'root'
})
export class DureeCongesService {
  constructor(private httpClient: HttpClient) { }

  public create(data) {
    return this.httpClient.post(baseUrl, [data]);
  }

  public update(id:number,data) {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }

  public delete(id:number) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  public getAll(id:number) {
    return this.httpClient.get(`${baseUrl}/all`);
  }

  public getCongeByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/conges/structure/${id}`);
  }


}
