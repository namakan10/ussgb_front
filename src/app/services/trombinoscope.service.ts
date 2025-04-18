import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HEADERS, REST_URL } from '../pages/REST_URL';
import {Util_fonction} from "../pages/models/util_fonction";

const url = REST_URL+"/trombinoscopes";
@Injectable({
  providedIn: 'root'
})
export class TrombinoscopeService {

  constructor(private httpClient: HttpClient) { }

  public getTrombinoscop(body,page?,size?) {
    // page = page===undefined? 0:page;
    // size = size===undefined? 100:size;

    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.idStructure)){
      param = param.append("idStructure", body.idStructure);
    }
    if (Util_fonction.checkIfNoTEmpty(body.anneeScolaire)){
      param = param.append("anneeScolaire", body.anneeScolaire);
    }
    if (Util_fonction.checkIfNoTEmpty(body.typeUtilisateur) && body.typeUtilisateur !== 'all') {
      param = param.append("type", body.typeUtilisateur);
    }
    if (Util_fonction.checkIfNoTEmpty(body.nom)){
      param = param.append("nom", body.nom);
    }
    if (Util_fonction.checkIfNoTEmpty(body.prenom)){
      param = param.append("prenom", body.prenom);
    }

      param = param.append("page", page===undefined? 0:page);
      param = param.append("size",  size===undefined? 100:size);

    return this.httpClient.get<any>(`${url}`, {params: param});


    // if(body.typeUtilisateur && body.nom && body.prenom){
    //   return this.httpClient.get(`${url}?type=${body.typeUtilisateur}&nom=${body.nom}&prenom=${body.prenom}&page=${page}&size=${size}`);
    // }  else if(body.typeUtilisateur && body.nom){
    //   return this.httpClient.get(`${url}?type=${body.typeUtilisateur}&nom=${body.nom}&page=${page}&size=${size}`);
    // } else if(body.typeUtilisateur && body.prenom){
    //   return this.httpClient.get(`${url}?type=${body.typeUtilisateur}&prenom=${body.prenom}&page=${page}&size=${size}`);
    // } else if(body.nom && body.prenom){
    //   return this.httpClient.get(`${url}?nom=${body.nom}&prenom=${body.prenom}&page=${page}&size=${size}`);
    // }else if(body.typeUtilisateur){
    //   if(body.typeUtilisateur==="all"){
    //     return this.httpClient.get<any>(`${url}?page=${page}&size=${size}`);
    //   }
    //   return this.httpClient.get(`${url}?type=${body.typeUtilisateur}&page=${page}&size=${size}`);
    //  }else if(body.nom){
    //   return this.httpClient.get(`${url}?nom=${body.nom}&page=${page}&size=${size}`);
    // } else if(body.prenom){
    //   return this.httpClient.get(`${url}?prenom=${body.prenom}&page=${page}&size=${size}`);
    // } else {
    //   return this.httpClient.get<any>(`${url}?page=${page}&size=${size}`);
    // }
  }

}
