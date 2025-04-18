import { Injectable } from '@angular/core';
import {REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Util_fonction} from "../pages/models/util_fonction";

const baseUrl = REST_URL+'/cv';
@Injectable({
  providedIn: 'root'
})
export class CvService {

  constructor(private httpClient: HttpClient) { }

  public getEtudiantCV(id) {
    return this.httpClient.get<any>(baseUrl+'/etudiant/'+id);
  }

  public getEnseignantCV(id) {
    return this.httpClient.get<any>(baseUrl+'/user/'+id);
  }
  public create(data) {
    // let param = new HttpParams();
    // if (Util_fonction.checkIfNoTEmpty(data.idUser)){
    //   param = param.append("idUser", data.idUser);
    // }
    // if (Util_fonction.checkIfNoTEmpty(data.fichier)){
    //   param = param.append("fichier", data.fichier);
    // }
    return this.httpClient.post(baseUrl, data);
  }
  public AddElementsToCV(idCv,body) {
    return this.httpClient.post(baseUrl+"/element/"+idCv, body);
  }

  public UpdatElement(idelement,body) {
    return this.httpClient.put(baseUrl+"/element/"+idelement, body);
  }

  public DeleteElemnt(idelement) {
    return this.httpClient.delete(baseUrl+"/element/"+idelement);
  }
}
