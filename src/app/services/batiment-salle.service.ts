import { Injectable } from '@angular/core';
import {REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Util_fonction} from "../pages/models/util_fonction";


const baseUrl = REST_URL+"/salles";
const batimentbaseUrl = REST_URL+"/batiments";
const equipementbaseUrl = REST_URL+"/equipementSalles";


@Injectable({
  providedIn: 'root'
})
export class BatimentSalleService {

  constructor(private httpClient: HttpClient) { }

  public Get_StructureBatuments(id_structure) {
    return this.httpClient.get<any>(`${batimentbaseUrl}/structure/`+id_structure);
  }
  public GetBatimentSalle(id_departement) {
    return this.httpClient.get<any>(`${baseUrl}/batiment/`+id_departement);
  }
  public GetStructureSalles(id_structure) {
    return this.httpClient.get<any>(`${baseUrl}/structure/`+id_structure, {params:{'id_structure':id_structure}});
  }

  public GetStructureSalles2(data) {
    console.log(data);
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append("id_structure", data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.id_batiment)){
      param = param.append("id_batiment", data.id_batiment);
    }
    return this.httpClient.get<any>(`${baseUrl}`, {params:param});
  }
  public AddBatiment(Body) {
    return this.httpClient.post<any>(`${batimentbaseUrl}`, Body);
  }

  public UpdateBatiment(id_batiment, Body) {
    return this.httpClient.put(`${batimentbaseUrl}/${id_batiment}`, Body);
  }

  public DeleteBatiment(idBatiment) {
    return this.httpClient.delete(`${batimentbaseUrl}/${idBatiment}`);
  }

  //SALLE +++

  public AddSalle(Body) {
    return this.httpClient.post<any>(`${baseUrl}`, Body);
  }
  public UpdateSalle(id_salle, Body) {
    return this.httpClient.put(`${baseUrl}/${id_salle}`, Body);
  }
  public DeleteSalle(id_division) {
    return this.httpClient.delete(`${baseUrl}/${id_division}`);
  }

  public GetSallesOfBatiment(data) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append("id_structure", data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.id_batiment)){
      param = param.append("id_batiment", data.id_batiment);
    }
    return this.httpClient.get<any>(`${baseUrl}`, {params: param});
  }


//  EQUIPEMENT
  public AddEquipement(Body) {
    return this.httpClient.post<any>(`${equipementbaseUrl}`, Body);
  }

  public UpdateEquipement(id_equipement, Body) {
    return this.httpClient.put(`${equipementbaseUrl}/${id_equipement}`, Body);
  }

  public DeleteEquipement(idEquipement) {
    return this.httpClient.delete(`${equipementbaseUrl}/${idEquipement}`);
  }

  public GetEquipementsByCritere(data) {
    console.log("data --", data);
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append("id_structure", data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.id_salle)){
      param = param.append("id_salle", data.id_salle);
    }
    return this.httpClient.get<any>(`${equipementbaseUrl}`, {params: param});
  }
}
