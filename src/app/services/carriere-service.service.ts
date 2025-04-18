import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../pages/REST_URL";


const baseUrl = REST_URL+'/carrieres';

@Injectable({
  providedIn: 'root'
})
export class CarriereService {


  constructor(private httpClient: HttpClient) { }

  public create(data) {
    return this.httpClient.post(baseUrl, data);
  }

  public getEnseignantByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/enseignants/structure/${id}`);
  }

  public getUsersByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/personnelsAdministratif/structure/${id}`);
  }

  public updatePersonnel(id:number,data) {
    return this.httpClient.put(`${baseUrl}/personnelAdministatif/${id}`, data);
  }

  public updateEnseignant(id:number,data) {
    return this.httpClient.put(`${baseUrl}/enseignant/${id}`, data);
  }


  public delete(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }


  public getFonctionsByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/specialiteFonction`);
  }

  public getDonneePersonnel() {
    return this.httpClient.get(`${REST_URL}/donneesPersonnels`);
  }



}
