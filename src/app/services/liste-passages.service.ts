import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../pages/REST_URL";
import {Util_fonction} from "../pages/models/util_fonction";

const urlSansDetteL2 = REST_URL+"/listPassage/admisSansDettesL2";
const urlSansDetteL3 = REST_URL+"/listPassage/admisSansDettesL3";

const urlAvecDetteL2 = REST_URL+"/listPassage/admisAvecDettesL2";
const urlAvecDetteL3 = REST_URL+"/listPassage/admisAvecDettesL3";

const redoublantL1 = REST_URL+"/listPassage/redoublantL1";
const redoublantL2 = REST_URL+"/listPassage/redoublantL2";
const redoublantL3 = REST_URL+"/listPassage/redoublantL3";

const admisLicence = REST_URL+"/listPassage/admisLicence";

const ueNonEvaluee = REST_URL+"/listPassage/ueNonEvaluee";

const noteManquanteL1 = REST_URL+"/listPassage/noteManquanteL1";
const noteManquanteL2 = REST_URL+"/listPassage/noteManquanteL2";
const noteManquanteL3 = REST_URL+"/listPassage/noteManquanteL3";


@Injectable({
  providedIn: 'root'
})
export class ListePassagesService {

  constructor(private httpClient: HttpClient) { }


  public GetParams(body){
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
      param = param.append("id_structure", body.id_structure);
    }

    if (Util_fonction.checkIfNoTEmpty(body.annee_scolaire)){
      param = param.append("annee_scolaire", body.annee_scolaire);
    }

    if (Util_fonction.checkIfNoTEmpty(body.code_option)){
      param = param.append("code_option", body.code_option);
    }

    if (Util_fonction.checkIfNoTEmpty(body.num_etudiant)){
      param = param.append("num_etudiant", body.num_etudiant);
    }
    param = param.append("size", "500000");
    return param;
  }

/* ===================================================================================== */


  public Get__Admin_Licence(body){
   let param = this.GetParams(body);
    return this.httpClient.get<any>(`${admisLicence}`, {params: param});
  }

  public Get__SansDetteL2(body){
   let param = this.GetParams(body);
    return this.httpClient.get<any>(`${urlSansDetteL2}`, {params: param});
  }

  public Get__SansDetteL3(body){
    let param = this.GetParams(body);
    return this.httpClient.get<any>(`${urlSansDetteL3}`, {params: param});
  }


  public Get__AvecDetteL2(body){
    let param = this.GetParams(body);
    return this.httpClient.get<any>(`${urlAvecDetteL2}`, {params: param});
  }

  public Get__AvecDetteL3(body){
    let param = this.GetParams(body);
    return this.httpClient.get<any>(`${urlAvecDetteL3}`, {params: param});
  }

   public Get__RedoublantL1(body){
     let param = this.GetParams(body);
    return this.httpClient.get<any>(`${redoublantL1}`, {params: param});
  }

  public Get__RedoublantL2(body){
    let param = this.GetParams(body);
    return this.httpClient.get<any>(`${redoublantL2}`, {params: param});
  }

  public Get__RedoublantL3(body){
    let param = this.GetParams(body);
    return this.httpClient.get<any>(`${redoublantL3}`, {params: param});
  }

  public Get__NoteManquantL1(body){
    let param = this.GetParams(body);
    return this.httpClient.get<any>(`${noteManquanteL1}`, {params: param});
  }

  public Get__NoteManquantL2(body){
    let param = this.GetParams(body);
    return this.httpClient.get<any>(`${noteManquanteL2}`, {params: param});
  }

  public Get__NoteManquantL3(body){
    let param = this.GetParams(body);
    return this.httpClient.get<any>(`${noteManquanteL3}`, {params: param});
  }

  // =====================================================
  public Get__UeNonEvaluee(num_etudiant){
    let param = new HttpParams();
    param = param.append("num_etudiant", num_etudiant);
    param = param.append("size", "500000");
    return this.httpClient.get<any>(`${ueNonEvaluee}`, {params: param});
  }

}
