import { Injectable } from '@angular/core';
import {REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpParams} from "@angular/common/http";

const url = REST_URL+"/versements"

const urlEncaissement = REST_URL+"/paiements/personnelAdministratif";


@Injectable({
  providedIn: 'root'
})
export class VersementService {

  constructor(private http: HttpClient) { }

  GetListCompta(idStructure){
    return this.http.get(url+"/listComptable/"+idStructure);
  }

  GetVersements(body){
    let parm = new HttpParams();
      if (body.idStructure !== null && body.idStructure !== ""){
        parm = parm.append("idStructure",body.idStructure);
      }

      if(body.idAgentComptable !== null && body.idAgentComptable !== ""){
        parm = parm.append("idAgentComptable",body.idAgentComptable);
      }

      if(body.idChefComptable !== null && body.idChefComptable !== ""){
        parm = parm.append("idChefComptable",body.idChefComptable);
      }

      if(body.annee !== null && body.annee !== ""){
        parm = parm.append("annee",body.annee);
      }

      if(body.type !== null && body.type !== ""){
        parm = parm.append("type",body.type);
      }

      if(body.dateDebut !== null && body.dateDebut !== ""){
        parm = parm.append("dateDebut",body.dateDebut);
      }

      if(body.dateFin !== null && body.dateFin !== ""){
        parm = parm.append("dateFin",body.dateFin);
      }

      // if(body.montant !== null && body.montant !== ""){
      //   parm = parm.append("montant",body.montant);
      // }

      if(body.motif !== null && body.motif !== ""){
        parm = parm.append("motif",body.motif);
      }

      if(body.montant !== null && body.montant !== ""){
        parm = parm.append("montant",body.montant);
      }

      if(body.page !== null && body.page !== ""){
        parm = parm.append("page",body.page);
      }

      if(body.size !== null && body.size !== ""){
        parm = parm.append("size",body.size);
      }

    return this.http.get<any>(url, {params:parm}); //{params: parm}
  }


  GetEncaissements(body){
    let parm = new HttpParams();
      // if (body.idStructure !== null && body.idStructure !== ""){
      //   console.log('in Structure');
      //   parm = parm.append("idStructure",body.idStructure);
      // }

      if(body.id_personnel !== null && body.id_personnel !== ""){
        parm = parm.append("id_personnel",body.id_personnel);
      }

      if(body.type !== null && body.type !== ""){
        parm = parm.append("type",body.type);
      }

      if(body.dateDebut !== null && body.dateDebut !== ""){
        parm = parm.append("dateDebut",body.dateDebut);
      }

      if(body.dateFin !== null && body.dateFin !== ""){
        parm = parm.append("dateFin",body.dateFin);
      }


      if(body.page !== null && body.page !== ""){
        parm = parm.append("page",body.page);
      }

      if(body.size !== null && body.size !== ""){
        parm = parm.append("size",body.size);
      }

    console.log(parm);

    return this.http.get<any>(urlEncaissement+"/"+body.id_personnel, {params:parm}); //{params: parm}
  }


  SaveVersement(Body){
    console.log(Body);
    return this.http.post(url,Body);
  }

  UpdateVersement(id_versement,Body){
    return this.http.put(url+"/"+id_versement,Body);
  }

  DeleteVersement(id_versement){
    return this.http.delete(url+"/"+id_versement);
  }
}
