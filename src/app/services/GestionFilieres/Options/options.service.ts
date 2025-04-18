import { Injectable } from '@angular/core';
import {HEADERS, REST_URL} from "../../../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';
import {Util_fonction} from "../../../pages/models/util_fonction";


const url = REST_URL+"/options";
const urlParam = REST_URL+"/programmations-options";

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  constructor(private httpClient: HttpClient){
  }
  public createOptions(option) {
    return this.httpClient.post(url, option);
  }

  //---------PAramet
  public createProgrammationOptions(body) {
    return this.httpClient.post(urlParam+'/list', body);
  }

  public addOptionsToProgramme(id, options) {
    return this.httpClient.put(urlParam+'/'+id+'/add_options', options);
  }

  public getPramOptions(paramettres): Observable<any> {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(paramettres.id_filiere)){
      param = param.append("id_filiere", paramettres.id_filiere);
    }
    if (Util_fonction.checkIfNoTEmpty(paramettres.id_annee)){
      param = param.append("id_annee", paramettres.id_annee);
    }
    if (Util_fonction.checkIfNoTEmpty(paramettres.niveau)){
      param = param.append("niveau", paramettres.niveau);
    }
    return this.httpClient.get(url+'/filiere/'+paramettres.id_filiere+'/programmation', {params: param});
  }

  public getPramOptions2(paramettres): Observable<any> {
    let param = new HttpParams();
    // if (Util_fonction.checkIfNoTEmpty(paramettres.id_filiere)){
    //   param = param.append("id_filiere", paramettres.id_filiere);
    // }
    if (Util_fonction.checkIfNoTEmpty(paramettres.id_annee)){
      param = param.append("id_annee", paramettres.id_annee);
    }
    if (Util_fonction.checkIfNoTEmpty(paramettres.niveau)){
      param = param.append("niveau", paramettres.niveau);
    }
    return this.httpClient.get(urlParam, {params: param});
  }


  public getStructureOptions(id): Observable<any> {
    return this.httpClient.get(`${url}/structure/${id}`);
  }
  public getStructure_Options(id){
    return this.httpClient.get<any>(`${url}/structure/${id}`);
  }

  public getOptionsByFiliereID(id){
    return this.httpClient.get<any>(`${url}/filiere/${id}`);
  }

  public getEvenementByID(id){
    return this.httpClient.get(`${url}/${id}`);
  }

  public getOptions(id) {
    return this.httpClient.get<any>(`${url}/${id}`);
  }

  public addEvenement(evenement){
    return this.httpClient.post(url,evenement,{headers: HEADERS});
  }

  public updateOption(option) {
    return this.httpClient.put(`${url}/`+option.id, option);
  }
  public updateEvenement(structure) {
    return this.httpClient.put(`${url}/${structure.id}`, structure);
  }
  public deleteOptions(id) {
    return this.httpClient.delete(`${url}/${id}`);
  }

  public deleteParamOptions(id, body) {
    return this.httpClient.put(`${urlParam}/${id}/remove_options`, body);
  }

  public delete_Programmation(id) {
    return this.httpClient.delete(`${urlParam}/${id}`);
  }

}

