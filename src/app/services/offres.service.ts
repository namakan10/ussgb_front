import { Injectable } from '@angular/core';
import {HEADERS, REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";
import {nextSortDir} from "@swimlane/ngx-datatable";
import {Util_fonction} from "../pages/models/util_fonction";

const url = REST_URL+"/stages";
@Injectable({
  providedIn: 'root'
})
export class OffresService {

  constructor(private httpClient: HttpClient) { }

  public saveStageOffre(body){
    return this.httpClient.post(url, body);
  }

  public updateStageOffre(body, id){
    return this.httpClient.put(url+'/'+id, body);
  }

  public deleteStageOffre(id){
    return this.httpClient.delete(url+'/'+id);
  }

  public saveManifestation(body){
    return this.httpClient.post(REST_URL+'/manifestations/stage', body);
  }

  public getStructStages(body){
    let params = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.idStructure)){
      params = params.append("idStructure", body.idStructure);
    }
    if (Util_fonction.checkIfNoTEmpty(body.niveau)){
      params = params.append("niveau", body.niveau);
    }
    if (Util_fonction.checkIfNoTEmpty(body.libelle)){
      params = params.append("libelle", body.libelle);
    }
    if (Util_fonction.checkIfNoTEmpty(body.entreprise)){
      params = params.append("entreprise", body.entreprise);
    }
    return this.httpClient.get<any>(url, {params: params});
  }
  public getOffreByNiveau(body){
    return this.httpClient.post<any>(url+'/niveau',body);
  }
  public getOffreByEntreprise(body){
    return this.httpClient.get<any>(url+'/entreprise?nom='+body.nom+'&anneeScolaire='+body.anneeScolaire,body);
  }

  public GetListInteresseByOffre(idOffre){
    return this.httpClient.get<any>(REST_URL+'/manifestations/stage/see/'+idOffre);
  }
}
