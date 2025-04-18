import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../pages/REST_URL";
import {Util_fonction} from "../pages/models/util_fonction";

const url = REST_URL+"/demandesEtudiant";
const urlTransfert = REST_URL+"/transfers";

@Injectable({
  providedIn: 'root'
})
export class DemandeEtudiantService {

  constructor(private httpClient: HttpClient) { }

  saveDemande(data) {
    return this.httpClient.post(url, data);
  }

  updateDemande(id,data) {
    return this.httpClient.put(url+"/"+id, data);
  }


  TraiterLaDemande(id,data) {
    return this.httpClient.put(url+"/"+id+"/traitement", data);
  }

  TraiterLesDemandesCoches(data) {
    return this.httpClient.post(url+"/transfert_list", data);
  }

  GetDemandes(body, action) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.annee_scolaire)){
      param = param.append("annee_scolaire", body.annee_scolaire);
    }

    if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
      param = param.append("id_structure", body.id_structure);
    }

    if (Util_fonction.checkIfNoTEmpty(body.code_option)){
      param = param.append("code_option", body.code_option);
    }

    if (Util_fonction.checkIfNoTEmpty(body.niveau)){
      param = param.append("niveau", body.niveau);
    }

    if (Util_fonction.checkIfNoTEmpty(body.num_etudiant)){
      param = param.append("num_etudiant", body.num_etudiant);
    }

    param = param.append("page", "0");
    param = param.append("size", "100");

    if (action+'' === 'a_traiter'){
      return this.httpClient.get<any>(url, {params: param});
    } else {
      return this.httpClient.get<any>(url+'/mesDemandes', {params: param});
    }


  }

  GetEtudiantDemandes(id){
    return this.httpClient.get<any>(url+"/"+id);
  }

  deleteDemande(id){
    return this.httpClient.delete(url+"/"+id);
  }
  TransferValidation(body){
    return this.httpClient.put(urlTransfert+"/validate", body);
  }

  GetExternalTransferts(body){
    let param = new HttpParams()
    if (Util_fonction.checkIfNoTEmpty(body.idStructure)){
      param = param.append("idStructure",body.idStructure);
    }
    if (Util_fonction.checkIfNoTEmpty(body.idOption)){
      param = param.append("idOption",body.idOption);
    }
    if (Util_fonction.checkIfNoTEmpty(body.startDate)){
      param = param.append("startDate",body.startDate);
    }
    if (Util_fonction.checkIfNoTEmpty(body.endDate)){
      param = param.append("endDate",body.endDate);
    }
    if (Util_fonction.checkIfNoTEmpty(body.studentTel)){
      param = param.append("studentTel",body.studentTel);
    }
    return this.httpClient.get<any>(urlTransfert, {params: param});
  }
}
