import { Injectable } from '@angular/core';
import {HEADERS, REST_URL} from '../pages/REST_URL';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Util_fonction} from "../pages/models/util_fonction";

const baseUrl = REST_URL + '/preInscriptions';
// const baseUrl = REST_URL + '/preInscriptions-new';

@Injectable({
  providedIn: 'root'
})
export class PreInscriptionServiceService {

  constructor(private httpClient: HttpClient) { }

  public getByIdEtudiant(idEtudiant, annee){
    return this.httpClient.get(`${baseUrl}/searchBy?idEtudiant=${idEtudiant}&annee=${annee}`);
  }

  public getPreInscriptionByNumPreIncription(Body) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams()
    .set("nom", Body.nom)
    .set("prenom", Body.prenom)
    .set("telephone", Body.telephone)
    .set("email", Body.email)
    .set("numPreInscription", Body.numPreInscription);
    return this.httpClient.get(`${baseUrl}/check`, {params:params});
  }

    preInscriptions(data): Observable<any> {
    let date;
    if (data.dateInscription) {
      date = `&dateInscription=${data.dateInscription}`;
    } else {
      date = '';
    }
    let tel;
    if (data.telephone) {
      tel = `&telephone=${data.telephone}`;
    } else {
      tel = '';
    }
    let prenom;
    if (data.prenom) {
      prenom = `&prenom=${data.prenom}`;
    } else {
      prenom = '';
    }
    let nom;
    if (data.nom) {
      nom = `&nom=${data.nom}`;
    } else {
      nom = '';
    }

    // if (data.ans_resp === "usttb") {
      // tslint:disable-next-line:max-line-length
      return this.httpClient.get(baseUrl + `/listPreInscription/comptable?annee_scolaire=${data.annee}&etat_paiement=${data.etat_paiement}&niveau=${data.niveau}&id_structure=${data.id_structure}&page=${data.page}&size=${data.size}${date}${tel}${prenom}${nom}`, {headers: HEADERS});
    // }

    // if (data.ans_resp === "other") {
    //   return this.httpClient.get(REST_URL + `/reInscriptions/list/comptable?annee_scolaire=${data.annee}&etat_paiement=${data.etat_paiement}&niveau=${data.niveau}&id_structure=${data.id_structure}&page=${data.page}&size=${data.size}${date}${tel}${prenom}${nom}`, {headers: HEADERS});
    // }

  }

  mesEncaissementList(data): Observable<any> {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append("id_structure",data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.dateDebut)){
      param = param.append("dateDebut",data.dateDebut);
    }

    if (Util_fonction.checkIfNoTEmpty(data.id_personnel)){
      param = param.append("id_personnel",data.id_personnel);
    }

    if (Util_fonction.checkIfNoTEmpty(data.dateFin)){
      param = param.append("dateFin",data.dateFin);
    }


    param = param.append("type", "LIST");

    param = param.append("page","0");
    param = param.append("size","100000000");


    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(REST_URL + `/paiements`, {params: param});
  }

  mesEncaissementSum(data): Observable<any> {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append("id_structure",data.id_structure);
    }

    if (Util_fonction.checkIfNoTEmpty(data.dateDebut)){
      param = param.append("dateDebut",data.dateDebut);
    }

    if (Util_fonction.checkIfNoTEmpty(data.id_personnel)){
      param = param.append("id_personnel",data.id_personnel);
    }

    if (Util_fonction.checkIfNoTEmpty(data.dateFin)){
      param = param.append("dateFin",data.dateFin);
    }


    param = param.append("type","SUM");
    param = param.append("page","0");
    param = param.append("size","1000000000");


    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(REST_URL + `/paiements`, {params: param});
  }
  listInscrits(data): Observable<any> {
    // tslint:disable-next-line:max-line-length
    let date;
    if (data.dateInscription) {
      date = `&dateInscription=${data.dateInscription}`;
    } else {
      date = '';
    }
    let tel;
    if (data.telephone) {
      tel = `&telephone=${data.telephone}`;
    } else {
      tel = '';
    }
    let prenom;
    if (data.prenom) {
      prenom = `&prenom=${data.prenom}`;
    } else {
      prenom = '';
    }
    let nom;
    if (data.nom) {
      nom = `&nom=${data.nom}`;
    } else {
      nom = '';
    }
    let statut;
    if (data.statut && data.statut !== 'all') {
      statut = `&statut=${data.statut}`;
    } else {
      statut = '';
    }

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(baseUrl + `/listInscrits?annee_scolaire=${data.annee}&niveau=${data.niveau}&id_structure=${data.id_structure}&page=${data.page}&size=${data.size}${date}${tel}${prenom}${nom}${statut}`, {headers: HEADERS});

  }

  preInscriptionsSecretaire(data): Observable<any> {
    console.log(data);
    let date;
    if (Util_fonction.checkIfNoTEmpty(data.dateInscription)) {
      date = `&dateInscription=${data.dateInscription}`;
    } else {
      date = '';
    }
    let tel;
    if (Util_fonction.checkIfNoTEmpty(data.telephone)) {
      tel = `&telephone=${data.telephone}`;
    } else {
      tel = '';
    }
    let prenom;
    if (Util_fonction.checkIfNoTEmpty(data.prenom)) {
      prenom = `&prenom=${data.prenom}`;
    } else {
      prenom = '';
    }
    let nom;
    if (Util_fonction.checkIfNoTEmpty(data.nom)) {
      nom = `&nom=${data.nom}`;
    } else {
      nom = '';
    }

    // if (data.ans_resp === "current") {
      // tslint:disable-next-line:max-line-length
      return this.httpClient.get(baseUrl + `/listPreInscription/secretaire?annee_scolaire=${data.annee_scolaire}&niveau=${data.niveau}&id_structure=${data.id_structure}&page=${data.page}&size=${data.size}${date}${tel}${prenom}${nom}`, {headers: HEADERS});
    // }

    // if (data.ans_resp === "passe") {
    //   // tslint:disable-next-line:max-line-length
    //   return this.httpClient.get<any>(REST_URL + `/reInscriptions/list/secretaire?annee_scolaire=${data.annee_scolaire}&niveau=${data.niveau}&id_structure=${data.id_structure}&page=${data.page}&size=${data.size}${date}${tel}${prenom}${nom}`);
    // }
  }

  validateInscription(data) {
    if (data.ans_resp === "preInscription") {
      return this.httpClient.post(REST_URL + '/inscriptions', data, {headers: HEADERS});
    } else {
      return this.httpClient.post(REST_URL + '/reInscriptions/validate', data, {headers: HEADERS});
    }

    // if (data.ans_resp === "passe") {
    //   return this.httpClient.post(REST_URL + '/reInscriptions/validate', data, {headers: HEADERS});
    // }
  }

  // FSEG
  validateReInscription(data) {
    return this.httpClient.post(REST_URL + '/reInscriptions/validate', data);
  }

  paiementFrais(data, cas) {
    // console.log(data);
    return this.httpClient.post(REST_URL + '/'+cas, data, {headers: HEADERS});
    // return this.httpClient.post(REST_URL + '/reInscriptions/paiement', data, {headers: HEADERS});
  }

  savePreInscription(preInscription, files) {
    // const head = new HttpHeaders().set("Content-Type", "multipart/form-data")
    // let parms = new HttpParams()
    //     parms = parms.append("preInscriptionString", preInscription);
    // let body = {
    //   preInscriptionString: JSON.stringify(preInscription)
    // }
    // console.log(datacontant);
    // console.log(files);


    let datacontant = JSON.stringify(preInscription);
    const fd = new FormData();
      fd.append("preInscriptionString", datacontant);
      fd.append("id_photo",files.id_photo);
      fd.append("diplome",files.diplome);
      fd.append("acteNaissance",files.acteNaissance);
      fd.append("releve",files.releve);
      fd.append("certificatNationnalite",files.certificatNationnalite);

    return this.httpClient.post(baseUrl+"/new", fd);
  }

  public updatePreInscription(idDossier, preInscription, files) {
    let parms = new HttpParams()
      .set("preInscriptionString", JSON.stringify(preInscription));
    const fd = new FormData();

    if (files.id_photo !== null){
      fd.append("id_photo",files.id_photo);
    }
    if (files.diplome !== null){
      fd.append("diplome",files.diplome);
    }
    if (files.acteNaissance !== null){
      fd.append("acteNaissance",files.acteNaissance);
    }
    if (files.releve !== null){
      fd.append("releve",files.releve);
    }

    if (files.certificatNationnalite !== null){
      fd.append("certificatNationnalite",files.certificatNationnalite);
    }
    return this.httpClient.put(`${baseUrl}/${idDossier}`,fd,{params: parms});
  }


  public preinscriptionUpdateFile(id, body) {
    return this.httpClient.put(`${baseUrl}/${id}`, body, {headers: HEADERS});
  }

  // tslint:disable-next-line:max-line-length
  statistiquePreinscription(id_structure: any, annee_scolaire: any, niveau: any, id_option: any, id_filiere: any, periode: any): Observable<any> {
    return this.httpClient.get(REST_URL + `/preInscriptions/statistiques?id_structure=${id_structure}&annee_scolaire=${annee_scolaire}&niveau=${niveau}&id_option=${id_option}&id_filiere=${id_filiere}&periode=${periode}`, {headers: HEADERS});
  }

  // tslint:disable-next-line:max-line-length
  supprimerInscription(id: any): Observable<any> {
    return this.httpClient.delete(REST_URL + `/paiements/${id}`, {headers: HEADERS});
  }
  // tslint:disable-next-line:max-line-length
  supprimerPré_Inscription(id: any): Observable<any> {
    return this.httpClient.delete(REST_URL + `/preInscriptions/${id}`, {headers: HEADERS});
  }
}
