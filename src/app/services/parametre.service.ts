import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HEADERS, REST_URL } from '../pages/REST_URL';

const url = REST_URL+"/parametres";
@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  constructor(private httpClient: HttpClient){}

  public getStuctures(){
    return this.httpClient.get<[]>(url, {headers:HEADERS});
  }

  public getParametreByStructure(id_struct){
    return this.httpClient.get<any>(`${url}/structure/${id_struct}`);
  }
  public getParametreByID(id){
    return this.httpClient.get<any>(`${url}/${id}`);
  }
  public AddParametre(body){
    return this.httpClient.post(`${url}`,body);
  }
  public UpdateParametre(id, body){
    return this.httpClient.put(`${url}/${id}`,body);
  }
  public DeleteParametre(id){
    return this.httpClient.delete(`${url}/${id}`);
  }

}
