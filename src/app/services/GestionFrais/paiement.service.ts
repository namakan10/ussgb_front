import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HEADERS, REST_URL} from "../../pages/REST_URL";
import {Util_fonction} from "../../pages/models/util_fonction";

const baseUrl = REST_URL+'/paiement';
const baseUrlnew = REST_URL+'/paiements';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  constructor(private httpClient: HttpClient) { }

  public createPaiement(paiement, idCandidat) {
    return this.httpClient.post(`${baseUrl}/${idCandidat}`, paiement);
  }

  public updatePaiement(paiement) {
    return this.httpClient.put(`${baseUrl}/${paiement.id}`, paiement);
  }

  public getAllPaiement() {
    return this.httpClient.get(baseUrl);
  }

  public deletePaiement(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  public suivieEtutidant_Pay(idEtudiant) {
    return this.httpClient.get(`${baseUrlnew}/etudiant/`+idEtudiant);
  }

  public GetEtudiant_suivie(body) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.anneeScolaire)){
      param = param.append("annee_scolaire", body.anneeScolaire);
    }

    if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
      param = param.append("id_structure", body.id_structure);
    }

    if (Util_fonction.checkIfNoTEmpty(body.codeOption)){
      param = param.append("code_option", body.codeOption);
    }

    if (Util_fonction.checkIfNoTEmpty(body.motif)){
      param = param.append("motif", body.motif);
    }

    if (Util_fonction.checkIfNoTEmpty(body.niveau)){
      param = param.append("niveau", body.niveau);
    }

    if (Util_fonction.checkIfNoTEmpty(body.numEtudiant)){
      param = param.append("num_etudiant", body.numEtudiant);
    }

    if (Util_fonction.checkIfNoTEmpty(body.tout_payer)){
      param = param.append("tout_payer", body.tout_payer);
    }

    if (Util_fonction.checkIfNoTEmpty(body.type_candidat)){
        param = param.append("type_candidat", body.type_candidat);
    }

    param = param.append("page", body.page);
    param = param.append("size", body.size);

    return this.httpClient.get<any>(baseUrlnew+`/suiviePaiement`, {params:param});
  }

  paiement_Frais(data) {
    return this.httpClient.post(REST_URL + '/paiements', data, {headers: HEADERS});
  }

  update_paiement_Frais(idPaiement,data) {
    return this.httpClient.put(REST_URL + '/paiements/'+idPaiement, data, {headers: HEADERS});
  }
}
