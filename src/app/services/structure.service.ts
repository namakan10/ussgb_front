import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HEADERS, REST_URL} from "../pages/REST_URL";


// const url = REST_URL+"/structures";
const url = REST_URL+"/structures/list";
const API_URL2 = REST_URL+`/structures`;
const anneeUrl = REST_URL+"/annees";


// le decorateur injectable
@Injectable({
  providedIn: 'root'
})
export class StructureService {
  constructor(private httpClient: HttpClient){}

  public getStuctures(){
    return this.httpClient.get<any[]>(url, {headers:HEADERS});
  }

  public getStucture(id){
    return this.httpClient.get<any>(`${url}/${id}`);
  }

  public getLogo(filename){
    return this.httpClient.get(`${url}/logo/${filename}`);
  }

  public addStructure(structure){
    return this.httpClient.post(API_URL2,structure);
  }
  public updateStructure(structure) {
    return this.httpClient.put(`${API_URL2}/${structure.id}`, structure,{headers:HEADERS});
  }
  public deleteStructure(id) {
    return this.httpClient.delete(`${API_URL2}/${id}`);
  }
  /** **************************************************************************
   * Service de Gestion de L'année de la structure
   * ===========================================================================
   * **/

  // public getAnnees() {
  //   return this.httpClient.get(anneeUrl);
  // }

  public getAnneeByID(id){
    return this.httpClient.get(`${anneeUrl}/${id}`);
  }

  public getStuctureAnnees(structureID) {
    return this.httpClient.get<any>(`${anneeUrl}/structure/${structureID}`, {headers : HEADERS});
  }

  public getListComptable(structureID) {
    return this.httpClient.get(`${REST_URL}/versements/listComptable/${structureID}`, {headers : HEADERS});
  }

  public getComptableList(idStructure) {
    return this.httpClient.get(`${REST_URL}/users/byRole`, {params: {role: 'ROLE_COMPTABLE',idStructure: idStructure} });
  }

  public getChefComptableList(idStructure) {
    return this.httpClient.get(`${REST_URL}/users/byRole`, {params: {role: 'ROLE_CHEF_COMPTABLE',idStructure: idStructure} });
  }

  public getStructureCurrentAnnee(structureID) {
    return this.httpClient.get<any>(`${anneeUrl}/structure/encours/${structureID}`);
  }

  public getGroupes(annee:string,idStructure:number) {
    return this.httpClient.get<any>(`${REST_URL}/groupes?active=true&annee=${annee}&idStructure=${idStructure}`);
  }

  public getEtudiantsByGroupeID(id:number) {
    return this.httpClient.get<any>(`${REST_URL}/groupes/etudiant/${id}`);
  }

  public addResponsableGroupe(value) {
    return this.httpClient.put<any>(`${REST_URL}/groupes/addResponsable`, value);
  }


  public addAnnee(annee){
    // console.log(annee);
    return this.httpClient.post<any>(anneeUrl,annee);
  }
  public updateAnnee(annee) {
    return this.httpClient.put<any>(`${anneeUrl}/${annee.id}`, annee);
  }
  public deleteAnnee(id) {
    return this.httpClient.delete(`${anneeUrl}/${id}`);
  }

}
