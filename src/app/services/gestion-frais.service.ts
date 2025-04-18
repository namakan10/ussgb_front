import { Injectable } from '@angular/core';
import {REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Util_fonction} from "../pages/models/util_fonction";


const url = REST_URL+'/frais';
@Injectable({
  providedIn: 'root'
})
export class GestionFraisService {

    constructor(private httpClient: HttpClient) { }

    public getAllFrais(parameter) {
      let parm = new HttpParams();
      if (Util_fonction.checkIfNoTEmpty(parameter.id_structure)){
        parm = parm.append("id_structure", parameter.id_structure);
      }
      if (Util_fonction.checkIfNoTEmpty(parameter.id_filiere)){
        parm = parm.append("id_filiere", parameter.id_filiere);
      }
      if (Util_fonction.checkIfNoTEmpty(parameter.type_candidat)){
        parm = parm.append("type_candidat", parameter.type_candidat);
      }
      if (Util_fonction.checkIfNoTEmpty(parameter.type_frais)){
        parm = parm.append("type_frais", parameter.type_frais);
      }
        return this.httpClient.get<any>(url, {params: parm});
    }

    public getFrais(id) {
        return this.httpClient.get(`${url}/${id}`);
    }

    public getFraisFilter(body) {
        return this.httpClient.post(`${url}/filter`, body);
    }


    public enregistrerFrais(fraisInscription) {
        // fraisInscription.structures.splice(0, 1);
        return this.httpClient.post(url, fraisInscription);
    }
    public modifierFrais(id, fraisBody) {
        return this.httpClient.put(`${url}/${id}`, fraisBody);
    }


    public deleteFrais(id) {
        return this.httpClient.delete(`${url}/${id}`);
    }

}
