import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../../REST_URL";
import {Util_fonction} from '../../models/util_fonction';

const baseUrl = REST_URL+'/statistiques/evaluation';
const baseUrlEval = REST_URL+'/evaluations';

@Injectable({
  providedIn: 'root'
})
export class EvaluationValidationService {
  constructor(private httpClient: HttpClient) { }

  public getStatEvaluation(id:number,anneeScolaire:string,genre:boolean,evaluation?: any) {
    if(evaluation){
      return this.httpClient.get(`${baseUrl}?anneeScolaire=${anneeScolaire}&genre=${genre}&id_evaluation=${evaluation.id}`);
    } else {
      return this.httpClient.get(`${baseUrl}?anneeScolaire=${anneeScolaire}&genre=${genre}`);
    }
  }

  public getUEByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/ues/structure/${id}`);
  }
  public getElementConstitutifByUEId(ue) {
    return this.httpClient.get(`${REST_URL}/elementConstitutifs/ue/${ue.id}`);
  }

  public getEvaluation(anneeScolaire:string,ue?: any,ec?: any) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(anneeScolaire)){
      param = param.append("anneeScolaire",anneeScolaire);
    }

    if (Util_fonction.checkIfNoTEmpty(ue)){
      if (Util_fonction.checkIfNoTEmpty(ec)){
        param = param.append("id_ec",ec.id);
      }else {
        param = param.append("id_ue",ue.id);
      }
    }
    return this.httpClient.get(`${baseUrlEval}`, {params: param});
    // if(ue && ec){
    //   return this.httpClient.get(`${REST_URL}/evaluations?anneeScolaire=${anneeScolaire}&id_ue=${ue.id}&id_ec=${ec.id}`);
    // } else
    //   if(ue && ! ec){
    //   return this.httpClient.get(`${REST_URL}/evaluations?anneeScolaire=${anneeScolaire}&id_ue=${ue.id}`);
    // }else if(! ue && ec){
    //   return this.httpClient.get(`${REST_URL}/evaluations?anneeScolaire=${anneeScolaire}&id_ec=${ec.id}`);
    // } else {
    //   return this.httpClient.get(`${baseUrl}?anneeScolaire=${anneeScolaire}`);
    // }
  }

}
