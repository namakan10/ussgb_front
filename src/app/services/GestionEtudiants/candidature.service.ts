import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {REST_URL} from '../../pages/REST_URL';

const url = REST_URL + '/candidatures';

@Injectable({
  providedIn: 'root'
})

export class CandidatureService {


  constructor(private httpClient: HttpClient) { }

  // public getCandidatures(){
  //   return this.httpClient.get(url);
  // }
  //
  public getCandidatureByNumDossier(Body){
    return this.httpClient.post(`${url}/filter`,Body);
  }

  public addCandidature(Candidature, files) {
    let datacontant = JSON.stringify(Candidature);
    const fd = new FormData();
    fd.append("candidatureString", datacontant);

    // fd.append("ID_PHOTO",files.id_photo);
    // fd.append("DIPLOME",files.diplome);
    // fd.append("ACTE_DE_NAISSANCE",files.acteNaissance);
    // fd.append("RELEVE_NOTE",files.releve);
    // fd.append("CERTIFICAT_NATIONALITE",files.certificatNationnalite);

    fd.append("id_photo",files.id_photo);
    fd.append("diplome",files.diplome);
    fd.append("acteNaissance",files.acteNaissance);
    fd.append("releve",files.releve);
    fd.append("certificatNationnalite",files.certificatNationnalite);


    return this.httpClient.post(url, fd);

    // return this.httpClient.post(url, Candidature);
  }
  public updateCandidature(idDossier, body) {
    return this.httpClient.put(`${url}/${idDossier}`, body);
  }
  // public deleteStructure(id) {
  //   return this.httpClient.delete(`${url}/${id}`);
  // }


  testApi() {
    // let unirest = require("unirest");

  }
}
