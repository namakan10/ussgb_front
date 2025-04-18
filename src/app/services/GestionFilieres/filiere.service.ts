import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HEADERS, REST_URL} from "../../pages/REST_URL";
import {Util_fonction} from "../../pages/models/util_fonction";

const baseUrl = REST_URL+'/filieres';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {

  constructor(private httpClient: HttpClient) { }

  public createFiliere(filiere) {
    return this.httpClient.post(baseUrl, filiere);
  }

  public updateFiliere(id,filiere) {
    return this.httpClient.put(`${baseUrl}/${id}`, filiere);
  }
  public updateFiliere_Specialite(id_fil,specialites) {
    return this.httpClient.put(`${baseUrl}/filiereSpecialite/${id_fil}`, specialites);
  }

  public getAllFiliere() {
    return this.httpClient.get(baseUrl);
  }
  public getFilieres(id) {
    return this.httpClient.get(`${baseUrl}/${id}`);
  }

  public getStructureFilieres(id) {   //------------ xxxx
    let param = new HttpParams();
    param = param.append("id_structure", id);
    return this.httpClient.get<any>(`${baseUrl}`, {params: param});
  }

  public GetStructureFilieres(parameterBody) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(parameterBody.id_structure)){
      param = param.append("id_structure", parameterBody.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(parameterBody.id_departement)){
      param = param.append("id_departement", parameterBody.id_departement);
    }

    if (Util_fonction.checkIfNoTEmpty(parameterBody.id_specialiteCandidat)){
      param = param.append("id_specialiteCandidat", parameterBody.id_specialiteCandidat);
    }

    if (Util_fonction.checkIfNoTEmpty(parameterBody.cursus)){
      param = param.append("cursus", parameterBody.cursus);
    }
    return this.httpClient.get<any>(`${baseUrl}`, {params: param});
  }

  public getDepartementFilieres(id) {
    return this.httpClient.get<any>(`${baseUrl}/departement/${id}`);
  }


  public getFiliereByCandidatSpecialite(id_specialite,id_structure) {

    let body = {
      id_specialiteCandidat:id_specialite,
      id_structure:id_structure
    };
    return this.httpClient.post(`${baseUrl}/specialite`, body);
  }

  public deleteFiliere(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  public getOpions(candidat_id){
    return this.httpClient.get(`${baseUrl}/optionChoose/${candidat_id}`);
  }

}
