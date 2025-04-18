import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../pages/REST_URL";

const url = REST_URL+"/specialiteFonction_structure";
const baseUrl = REST_URL+"/specialiteFonction";

@Injectable({
  providedIn: 'root'
})
export class SpecialiteFonctionService {
  constructor(private httpClient: HttpClient) {}

  public addSpecialiteFoction(specialiteFoction) {
    return this.httpClient.post(baseUrl,specialiteFoction);
  }


  // request with params
  public getSpecialiteFoctions(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams()
      .set("id_structure", id); //Create new HttpParams
    return this.httpClient.get(baseUrl, {params: params});
  }

  public getSpecialiteFoction(id) {
    return this.httpClient.get(`${baseUrl}/${id}`);
  }


  public getAllFoctionSpecialite() {
    return this.httpClient.get(`${baseUrl}`);
  }

  public getSpecialiteFoctionByType(type) {
    return this.httpClient.get(`${baseUrl}/type/${type}`);
  }

  public updateSpecialiteFoction(specialiteFoction) {
    return this.httpClient.put(`${baseUrl}/${specialiteFoction.id}`, specialiteFoction);
  }

  public deleteSpecialiteFoction(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }
}
