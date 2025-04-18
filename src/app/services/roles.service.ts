import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {REST_URL} from "../pages/REST_URL";

const url = REST_URL+"/roles";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  public GetRoles(){
    return this.http.get<any>(url);
  }

  public AddRole(body){
    return this.http.post<any>(url, body);
  }

  public UpdateRole(id,body){
    return this.http.put<any>(url, body);
  }

  public DeleteRole(id){
    return this.http.delete(url+"/"+id);
  }
}
