import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Structure} from "../pages/models/Structure.model";
import {parseHttpResponse} from "selenium-webdriver/http";
import {HEADERS, REST_URL} from "../pages/REST_URL";
import {Util_fonction} from "../pages/models/util_fonction";


const url = REST_URL+"/evenements";

// le decorateur injectable
@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  constructor(private httpClient: HttpClient){
  }

  public getStucturesEvenements(parameters: any){
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(parameters.id_annee )){
      param = param.append("id_annee", parameters.id_annee);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.id_structure)){
      param = param.append("id_structure", parameters.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.type_evenement)){
      param = param.append("type_evenement", parameters.type_evenement);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.cursus )){
      param = param.append("cursus", parameters.cursus);
    }

    return this.httpClient.get<any>(`${url}`, {params: param});
  }

  public getStucturesEvenementVerif(parameters: any){
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(parameters.id_structure)){
      param = param.append("id_structure", parameters.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.type_evenement)){
      param = param.append("type_evenement", parameters.type_evenement);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.cursus )){
      param = param.append("cursus", parameters.cursus);
    }

    return this.httpClient.get<any>(`${url}/verification`, {params: param});
  }

  public getEvenementByID(id){
    return this.httpClient.get(`${url}/${id}`);
  }

  public getEvenementByTypeAnneeAndStructure(id, type, anneeScolaire){ // change ok

      let body = {
          annee_scolaire: anneeScolaire,
          type_evenement: type,
          id_structure: id
      };

    return this.httpClient.post(`${url}`,body);
  }

  public addEvenement(evenement){
    return this.httpClient.post(url+'/save ',evenement,{headers: HEADERS});
  }

  public updateEvenement(idEnvent, evenement) {
    return this.httpClient.put(`${url}/${idEnvent}`, evenement);
  }
  public deleteEvenement(id) {
    return this.httpClient.delete(`${url}/${id}`);
  }



}
