import { Injectable } from '@angular/core';
import {REST_URL} from '../pages/REST_URL';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Util_fonction} from '../pages/models/util_fonction';


const url = REST_URL+'/informations';
const urliInfoVisiteurs = REST_URL+'/informations';

@Injectable({
  providedIn: 'root'
})
export class InformationsPortailService {


  constructor(private http: HttpClient) { }

  //CAMPUS -VISITEUR INFO - ACTUALITE
  public SavePageInformations(body){
    console.log("body service ==> ", body);
    return this.http.post<any>(url, body);
  }

    public UpdatePageInformations(body){
      console.log("body ==> ", body);
    return this.http.put<any>(url, body);
  }

  public UpdatePageInformationsList(body){
    console.log("body 2 list ==> ", body);
    return this.http.put<any>(url+"/list", body);
  }

  public getPageInformations(type){
    let param = new HttpParams();
    param = param.append("search", "type="+type);
    return this.http.get<any>(url, {params: param});

  }

  public deleteInfo(id){
    return this.http.delete<any>(url+"/"+id);

  }
}
