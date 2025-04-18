import { Injectable } from '@angular/core';
import {REST_URL} from "../../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Util_fonction} from "../../pages/models/util_fonction";

const url = REST_URL+'/frais';
@Injectable({
  providedIn: 'root'
})
export class FraisService {

    constructor(private httpClient: HttpClient) { }

    public getAllFrais() {
        return this.httpClient.get(url);
    }

    public getFrais(id) {
        return this.httpClient.get(`${url}/${id}`);
    }

  /*
    Pour la scolarité
   */
  public get_Frais_filter(body:any){
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
      param = param.append("id_structure", body.id_structure)
    }
    if (Util_fonction.checkIfNoTEmpty(body.id_filiere)){
      param = param.append("id_filiere", body.id_filiere)
    }
    if (Util_fonction.checkIfNoTEmpty(body.type_candidat)){
      param = param.append("type_candidat", body.type_candidat)
    }
    if (Util_fonction.checkIfNoTEmpty(body.type_frais)){
    param = param.append("type_frais", body.type_frais)
    }

    return this.httpClient.get<any>(`${url}`, {params:param})
  }

    public getFraisFilter(body) {
        return this.httpClient.post(`${url}/filter`, body);
    }


   public enregistrerFrais(fraisInscription) {
          return this.httpClient.post(url, fraisInscription);
   }


  public deleteFrais(id) {
      return this.httpClient.delete(`${url}/${id}`);
  }


}
