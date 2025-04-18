import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../pages/REST_URL";
import {Util_fonction} from "../pages/models/util_fonction";


const baseUrl = REST_URL+'/affectations';

@Injectable({
  providedIn: 'root'
})
export class AffectationService {

  constructor(private httpClient: HttpClient) { }

  public create(data) {
    return this.httpClient.post(baseUrl, data);
  }


  public update(id:number,data) {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }

  public getAll() {
    return this.httpClient.get(`${baseUrl}`);
  }

  public delete(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }


  public getHistoriqueByStructureId(id:number) {
    return this.httpClient.get(`${baseUrl}/historique_structure/${id}`);
  }

  public getHistoriqueByDepartementId(id:number) {
    return this.httpClient.get(`${baseUrl}/historique_departement/${id}`);
  }

  public getServiceByStructure(id:number) {
    return this.httpClient.get(`${REST_URL}/services/structure/${id}`);
  }

  public getDivisionByService(id:number) {
    return this.httpClient.get(`${REST_URL}/divisions/service/${id}`);
  }

  public getAffectationEnseignantsByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/affectations/structure/enseignant/${id}`);
  }

  public getAffectationByDepartementId(id:number) {
    return this.httpClient.get(`${baseUrl}/departement/${id}`);
  }

  public getAffectationPersonnelByStructure(getBody) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(getBody.id_structure)){
      param = param.append("id_structure", getBody.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(getBody.typePersonnel)){
      param = param.append("typePersonnel", getBody.typePersonnel);
    }
    return this.httpClient.get(`${baseUrl}`, {params: param});
  }

  public getAffectationsByStructureId(id:number) {
    return this.httpClient.get(`${baseUrl}/structure/${id}`);
  }

  public getEnseignantByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/enseignants/structure/${id}`);
  }

  public getUsersByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/personnelsAdministratif/structure/${id}`);
  }

  public getFonctionsByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/specialiteFonction`);
  }


  public getDepartementByStructure(id:number) {
    return this.httpClient.get(`${REST_URL}/departements/structure/${id}`);
  }

  public getServicesByDepartement(id:number) {
    return this.httpClient.get(`${REST_URL}/services/departement/${id}`);
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
