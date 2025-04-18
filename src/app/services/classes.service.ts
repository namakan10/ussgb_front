import { Injectable } from '@angular/core';
import {HEADERS, REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Util_fonction} from "../pages/models/util_fonction";

const url = REST_URL+"/classes";
const GroupeUrl = REST_URL+"/groupes";

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(private  httpClient : HttpClient) { }


  public getClasses(paramBody){
    let params = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(paramBody.annee)){
      params = params.append("annee", paramBody.annee);
    }
    if (Util_fonction.checkIfNoTEmpty(paramBody.idStructure)){
      params = params.append("idStructure", paramBody.idStructure);
    }
    if (Util_fonction.checkIfNoTEmpty(paramBody.idOption)){
      params = params.append("idOption", paramBody.idOption);
    }
    if (Util_fonction.checkIfNoTEmpty(paramBody.niveau)){
      params = params.append("niveau", paramBody.niveau);
    }

    return this.httpClient.get<any>(url, {params: params});
  }

  public getGroupes(paramBody){
    let params = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(paramBody.annee)){
      params = params.append("annee", paramBody.annee);
    }
    if (Util_fonction.checkIfNoTEmpty(paramBody.idStructure)){
      params = params.append("idStructure", paramBody.idStructure);
    }
    if (Util_fonction.checkIfNoTEmpty(paramBody.niveau)){
      params = params.append("niveau", paramBody.niveau);
    }

    return this.httpClient.get<any>(GroupeUrl, {params: params});
  }

  public getClasse(id){
    return this.httpClient.get<any>(`${url}/${id}`);
  }
  public getClasseEtudiant(idClasse){
    return this.httpClient.get<any>(`${url}/etudiants/${idClasse}`);
  }
  //
  // public getLogo(filename){
  //   return this.httpClient.get(`${url}/logo/${filename}`);
  // }
  //
  // public addClasse(structure){
  //   console.log(structure);
  //   return this.httpClient.post(API_URL2,structure);
  // }
  // public updateClasse(structure) {
  //   return this.httpClient.put(`${API_URL2}/${structure.id}`, structure,{headers:HEADERS});
  // }
}

