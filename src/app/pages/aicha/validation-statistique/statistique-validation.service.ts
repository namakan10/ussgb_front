import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {REST_URL} from "../../REST_URL";
import {Util_fonction} from '../../models/util_fonction';

const baseUrl = REST_URL+'/statistiques/validation';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueValidationService {
  constructor(private httpClient: HttpClient) { }

  public getValidations(id:number,anneeScolaire:string,genre:boolean,ec?: any,ue?:any) {

    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(anneeScolaire)){
      param = param.append("anneeScolaire",anneeScolaire);
    }
    if (!!genre){
      param = param.append("genre",String(genre));
    }

    // if (Util_fonction.checkIfNoTEmpty(ue)){
    //   param = param.append("id_ue",ue);
    // }
    if (Util_fonction.checkIfNoTEmpty(ue)){
      if (Util_fonction.checkIfNoTEmpty(ec)){
        param = param.append("id_ec",ec.id);
      }else {
        param = param.append("id_ue",ue.id);
      }
    }
    return this.httpClient.get(`${baseUrl}`, {params: param});




    // if(ec && ue){
    //   return this.httpClient.get(`${baseUrl}?anneeScolaire=${anneeScolaire}&genre=${genre}&id_ec=${ec.id}&id_ue=${ue.id}`);
    // }  else if(ec && ! ue){
    //   return this.httpClient.get(`${baseUrl}?anneeScolaire=${anneeScolaire}&genre=${genre}&id_ec=${ec.id}`);
    // } else if(!ec && ue){
    //   return this.httpClient.get(`${baseUrl}?anneeScolaire=${anneeScolaire}&genre=${genre}&id_ue=${ue.id}`);
    // }else {
    //   console.log("AnneeScolaire",anneeScolaire)
    // //  return this.httpClient.get(`${baseUrl}?anneeScolaire=${anneeScolaire}&genre=${genre}`);
    //   return this.httpClient.get(`${baseUrl}?anneeScolaire=${anneeScolaire}`);
    // }
  }

  public getUEByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/ues/structure/${id}`);
  }


  public getElementConstitutifByUEId(ue) {
    return this.httpClient.get(`${REST_URL}/elementConstitutifs/ue/${ue.id}`);
  }

}
