import { Injectable } from '@angular/core';
import {REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";

const baseUrl = REST_URL+'/conditionsPassage';

@Injectable({
  providedIn: 'root'
})
export class ConditionPassageService {

  constructor(private httpClient : HttpClient) { }

  public GetConditions(id_structure) {
    let param = new HttpParams();
    param = param.append("id_structure",id_structure)
    return this.httpClient.get<any>(baseUrl, {params:param});
  }

  public AddCondition(body) {
    return this.httpClient.post(baseUrl, body);
  }

  public UpdatCondition(idelement,body) {
    return this.httpClient.put(baseUrl+"/"+idelement, body);
  }

  public DeleteCondition(idelement) {
    return this.httpClient.delete(baseUrl+"/"+idelement);
  }
}
