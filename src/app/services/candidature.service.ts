import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {HEADERS, REST_URL} from "../pages/REST_URL";
import { Observable } from 'rxjs';
import {Util_fonction} from "../pages/models/util_fonction";
import * as Util from "util";
@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

  constructor(private httpClient: HttpClient) { }

  statistique(id_structure: any, annee_scolaire: any, id_option: any, id_filiere: any, periode: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(REST_URL + `/candidatures/statistiques?id_structure=${id_structure}&annee_scolaire=${annee_scolaire}&id_option=${id_option}&id_filiere=${id_filiere}&periode=${periode}`, {headers:HEADERS});
  }

  listCandidature(path, data: any): Observable<any> {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append('id_structure', data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.annee)){
      param = param.append('annee_scolaire', data.annee);
    }
    if (Util_fonction.checkIfNoTEmpty(data.datePreInscription)){
      param = param.append('dateCandidature', data.datePreInscription);
    }
    if (Util_fonction.checkIfNoTEmpty(data.etat_paiement)){
      param = param.append('etat_paiement', data.etat_paiement);
    }
    if (Util_fonction.checkIfNoTEmpty(data.niveau)){
      param = param.append('niveau', data.niveau);
    }
    if (Util_fonction.checkIfNoTEmpty(data.nom)){
      param = param.append('nom', data.nom);
    }
    if (Util_fonction.checkIfNoTEmpty(data.prenom)){
      param = param.append('prenom', data.prenom);
    }
    if (Util_fonction.checkIfNoTEmpty(data.telephone)){
      param = param.append('telephone', data.telephone);
    }

      param = param.append('page', data.page);
      param = param.append('size', data.size);
    return this.httpClient.get(REST_URL + `/candidatures/listCandidature${path}`, {params: param, headers: HEADERS});

    // tslint:disable-next-line:max-line-length
    // return this.httpClient.get(REST_URL + `/candidatures/listCandidature${path}?annee_scolaire=${data.annee}&niveau=${data.niveau}&id_structure=${data.id_structure}`, {headers: HEADERS});
  }

  getCandidatureATraiter(data): Observable<any> {

    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append('id_structure', data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.annee_scolaire)){
      param = param.append('annee_scolaire', data.annee_scolaire);
    }

      // param = param.append('approbation', data.approbation);
      //
      //
      // param = param.append('admis', data.admis);

    if (Util_fonction.checkIfNoTEmpty(data.dateCandidature)){
      param = param.append('dateCandidature', data.dateCandidature);
    }

    if (Util_fonction.checkIfNoTEmpty(data.niveau)){
      param = param.append('niveau', data.niveau);
    }
    if (Util_fonction.checkIfNoTEmpty(data.nom)){
      param = param.append('nom', data.nom);
    }
    if (Util_fonction.checkIfNoTEmpty(data.prenom)){
      param = param.append('prenom', data.prenom);
    }
    if (Util_fonction.checkIfNoTEmpty(data.telephone)){
      param = param.append('telephone', data.telephone);
    }

    param = param.append('page', data.page);
    param = param.append('size', data.size);

    return this.httpClient.get<any>(REST_URL + `/candidatures/listCandidature/secretaire`, {params: param, headers: HEADERS});
  }

  dossiersTraiter(data): Observable<any> {

    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append('id_structure', data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.annee_scolaire)){
      param = param.append('annee_scolaire', data.annee_scolaire);
    }
    if (Util_fonction.checkIfNoTEmpty(data.dateCandidature)){
      param = param.append('dateCandidature', data.dateCandidature);
    }
    if (Util_fonction.checkIfNoTEmpty(data.admis)){
      param = param.append('admis', data.admis);
    }
    if (Util_fonction.checkIfNoTEmpty(data.approbation)){
          param = param.append('approbation', data.approbation);
    }
    if (Util_fonction.checkIfNoTEmpty(data.niveau)){
      param = param.append('niveau', data.niveau);
    }
    if (Util_fonction.checkIfNoTEmpty(data.nom)){
      param = param.append('nom', data.nom);
    }
    if (Util_fonction.checkIfNoTEmpty(data.prenom)){
      param = param.append('prenom', data.prenom);
    }
    if (Util_fonction.checkIfNoTEmpty(data.telephone)){
      param = param.append('telephone', data.telephone);
    }

    param = param.append('page', data.page);
    param = param.append('size', data.size);

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<any>(REST_URL + `/candidatures/listCandidature/secretaire`, {params: param, headers: HEADERS});
  }

  admisList(data): Observable<any> {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      param = param.append('id_structure', data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.annee_scolaire)){
      param = param.append('annee_scolaire', data.annee_scolaire);
    }

    if (Util_fonction.checkIfNoTEmpty(data.admis)){
      param = param.append('admis', data.admis);
    }
    // if (Util_fonction.checkIfNoTEmpty(data.approbation)){
    //   param = param.append('approbation', data.approbation);
    // }
    if (Util_fonction.checkIfNoTEmpty(data.niveau)){
      param = param.append('niveau', data.niveau);
    }


    param = param.append('page', data.page);
    param = param.append('size', data.size);
    return this.httpClient.get<any>(REST_URL + `/candidatures/listCandidature/secretaire`, {params: param, headers: HEADERS});

    // tslint:disable-next-line:max-line-length
    // return this.httpClient.get(REST_URL + `/candidatures/listCandidature/admisNonAdmins?annee_scolaire=${annee_scolaire}&admis=${admis}&id_structure=${id_structure}`, {headers: HEADERS});
  }

  changeValidate(id, data): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.put(REST_URL + `/candidatures/validation/` + id, data, {headers: HEADERS});
  }

  changeValidateToAdmis(id, data): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.put(REST_URL + `/candidatures/admission/` + id, data);
  }


  getEtudiantByNumEtudiant(numEtudiant){
    //
    // let param = new HttpParams();
    // if (Util_fonction.checkIfNoTEmpty(numEtudiant)){
    //   param = param.append("num_etudiant", numEtudiant)
    // }
    // return this.httpClient.get<any>(REST_URL + `/candidatures/numEtudiant/`+numEtudiant);
    return this.httpClient.get<any>(REST_URL + `/etudiants/numEtudiant/`+numEtudiant);
  }
}
