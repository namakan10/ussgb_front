import { Injectable } from '@angular/core';
import {REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Util_fonction} from "../pages/models/util_fonction";

const url = REST_URL+'/history';

@Injectable({
  providedIn: 'root'
})
export class HistoriquesService {

  constructor(private http: HttpClient) { }

  public getHistoriques(body, choix){
    let param = new HttpParams();

    if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
      param = param.append('id_structure', body.id_structure);
    }

    if (Util_fonction.checkIfNoTEmpty(body.endDate)){
      param = param.append('endDate', body.endDate);
    }

    if (Util_fonction.checkIfNoTEmpty(body.startDate)){
      param = param.append('startDate', body.startDate);
    }

    if (Util_fonction.checkIfNoTEmpty(body.operation)){
        param = param.append('operation', body.operation);
    }

    if (Util_fonction.checkIfNoTEmpty(body.table)){
        param = param.append('table', body.table);
    }

    param = param.append('page', '0');
    param = param.append('size', '5500');

    if (Util_fonction.checkIfNoTEmpty(body.date)){
      param = param.append('date', body.date);
    }

    if (!choix){
      return this.http.get<any>(url, {params: param});
    } else {
      return this.http.get<any>(url+'/between', {params: param});
    }
  }

}
