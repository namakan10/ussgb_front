import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../../pages/REST_URL";
import {Util_fonction} from "../../pages/models/util_fonction";

const baseUrl = REST_URL+'/frais_scolarite';
const baseScolariteUrl = REST_URL+'/scolarites';

@Injectable({
  providedIn: 'root'
})
export class FraisScolariteService {

  constructor(private httpClient: HttpClient) { }

  public enregistrerFrais(Frais) {
    return this.httpClient.post(baseUrl, Frais);
  }

  public updateFraisScolarite(Frais) {
    return this.httpClient.put(`${baseUrl}/${Frais.id}`, Frais);
  }

  public getFraisScolarite() {
    return this.httpClient.get(baseUrl);
  }

  public deleteFrais(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  /*
    Pour la scolarité
   */
  public GetDemandeCarteNonTraite(body:any){
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.anneeScolaire)){
      param = param.append("anneeScolaire", body.anneeScolaire)
    }
    if (Util_fonction.checkIfNoTEmpty(body.numEtudiant)){
      param = param.append("numEtudiant", body.numEtudiant)
    }
    param = param.append("page", "0");
    param = param.append("size", "5000");
    return this.httpClient.get<any>(`${baseScolariteUrl}/demandesImpressionDeCarteNonTraite`, {params:param})
  }

  public GetEtudiantCarte(id: any){
    return this.httpClient.get<any>(`${baseScolariteUrl}/demande/`+id+'/carteEtudiant');
  }
}
