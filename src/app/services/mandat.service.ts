import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Structure} from "../pages/models/Structure.model";
import {parseHttpResponse} from "selenium-webdriver/http";
import {HEADERS, REST_URL} from "../pages/REST_URL";
import {Util_fonction} from "../pages/models/util_fonction";


const url = REST_URL+"/mandats";

// le decorateur injectable
@Injectable({
  providedIn: 'root'
})
export class MandatService {
  constructor(private httpClient: HttpClient){
  }

  public getListMendat(search: any){
    return this.httpClient.get<any>(`${url}?page=0&size=1000&sort=id,desc` + search);
  }

  public addMandat(body){
    return this.httpClient.post(url , body, {headers: HEADERS});
  }

  public updateMandat(body) {
    return this.httpClient.put(`${url}`, body);
  }
  public deleteMandat(id) {
    return this.httpClient.delete(`${url}/${id}`);
  }

}
