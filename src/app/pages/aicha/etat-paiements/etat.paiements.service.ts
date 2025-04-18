import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../../REST_URL";

const baseUrl = REST_URL+'/paiements';

@Injectable({
  providedIn: 'root'
})
export class EtatPaiementsService {

  constructor(private httpClient: HttpClient) { }

  public create(data) {
    return this.httpClient.post(baseUrl, data);
  }

  public update(id:number,data) {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }

  public updateCourier(id:number,type:string,data) {
    return this.httpClient.put(`${baseUrl}/${type}/${id}`, data);
  }

  public delete(id:number) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  public getPaiements(data) {
    if (data.personnel){
      return this.httpClient.get(`${baseUrl}/?id_structure=${data.id}&id_personnel=${data.personnel}&dateDebut=${data.debut}&dateFin=${data.fin}&page=${data.page}&size=${data.size}`);
    }else {
      return this.httpClient.get(`${baseUrl}/?id_structure=${data.id}&dateDebut=${data.debut}&dateFin=${data.fin}&page=${data.page}&size=${data.size}`);
    }

  }


  public getPersonnels(data,page=0,size=50) {
    if(!data.nom || !data.prenom) {
      return this.httpClient.get(`${REST_URL}/personnels?id_structure=${data.id}&role=${data.role}&page=${page}&size=${size}`);
    }else {
      return this.httpClient.get(`${REST_URL}/personnels?id_structure=${data.id}&role=${data.role}&nom=${data.nom}&prenom=${data.prenom}&page=${page}&size=${size}`);
    }
  }



}
