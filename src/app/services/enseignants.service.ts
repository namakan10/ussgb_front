import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HEADERS, REST_URL} from "../pages/REST_URL";


const url = REST_URL+"/enseignants";
const urlNEW = REST_URL+"/personnels";
const baseUrl = REST_URL+"/batiments";
const baseUrl1 = REST_URL+"/salles";
const baseUrl2 = REST_URL+"/equipementSalles";
@Injectable({
  providedIn: 'root'
})
export class EnseignantsService {
  constructor(private httpClient: HttpClient){}

  public getUserByRole(role:string){
    return this.httpClient.get <any>(`${REST_URL}/users/byRole?role=${role}`);
  }
  public getStructureEnseignants(id){
    return this.httpClient.get <any>(`${url}/structure/${id}`);
  }
  public addEnseignant(enseignant) {
    return this.httpClient.post(urlNEW,enseignant);
  }
  public getEnseignants(){
    return this.httpClient.get<any>(`${url}`);
  }
  public geStructureBatiments(id){
    return this.httpClient.get <any>(`${baseUrl}/structure/${id}`);
  }
  public addBatiment(batiment) {
    return this.httpClient.post(baseUrl,batiment);
  }
  public getBatiments(id){
    return this.httpClient.get(`${baseUrl}/${id}`);
  }
  public deleteBatiment(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }
  public updateBatimen(batiment) {
    return this.httpClient.put(`${baseUrl}/${batiment.id}`, batiment);
  }
  public geStructuretSalles(id){
    return this.httpClient.get <any>(`${baseUrl1}/batiment/${id}`);
  }
  public addSalle(salle) {
    return this.httpClient.post(baseUrl1,salle);
  }
  public getSalles(id){
    // console.log("salle == ", id);
    return this.httpClient.get<any>(`${baseUrl1}/${id}`);
  }
  public deleteSalle(id) {
    return this.httpClient.delete(`${baseUrl1}/${id}`);
  }
  public geStructuretEquip(id){
    return this.httpClient.get <any>(`${baseUrl2}/salle/${id}`);
  }
  public addEquipement(equipement) {
    return this.httpClient.post(baseUrl2,equipement);
  }
  public getEquip(id){
    return this.httpClient.get<any>(`${baseUrl2}/${id}`);
  }
  public getEquipementSalles(id){
    return this.httpClient.get<any>(`${baseUrl2}/salle/${id}`);
  }
  public deleteEquip(id) {
    return this.httpClient.delete(`${baseUrl2}/${id}`);
  }
  public getLogo(filename){
    return this.httpClient.get(`${url}/logo/${filename}`);
  }

  public addStructure(structure){
    console.log(structure);
    return this.httpClient.post(url,structure);
  }
  public updateStructure(structure) {
    return this.httpClient.put(`${url}/${structure.id}`, structure);
  }

  //- ---------------------------------------------------------
  //- ---------------------------------------------------------

  public getEffectivite(id, data) {
    return this.httpClient.post(REST_URL + '/effectivites/' + id, data);
}

  public deleteEnseignant(id) {
    return this.httpClient.delete(`${url}/${id}`);
  }

  public getAllEnseignants(){
    return this.httpClient.get(`${url}`);
  }

  public updateSalle(salle) {
    return this.httpClient.put(`${baseUrl1}/${salle.id}`, salle);
  }

  public updateEquip(equipement) {
    return this.httpClient.put(`${baseUrl2}/${equipement.id}`, equipement);
  }

  public updateEnseignant(esnsID, enseingnant) {
    console.log(enseingnant);
    return this.httpClient.put(`${url}/${esnsID}`, enseingnant);
  }

  public getTeacherByDer(ID) {
    return this.httpClient.get(`${url}/departement/${ID}`);
  }





}

