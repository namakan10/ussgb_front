import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HEADERS, REST_URL} from "../pages/REST_URL";
import {Observable} from "rxjs";
import {Util_fonction} from "../pages/models/util_fonction";

const baseUrl = REST_URL+'/ues';

@Injectable({
  providedIn: 'root'
})
export class UesServiceService {
  constructor(private httpClient: HttpClient) { }

  // public createUes(ues) {
  //   return this.httpClient.post(baseUrl, ues);
  // }

  public updateUes(ues) {
    return this.httpClient.put(`${baseUrl}/${ues.id}`, ues);
  }
  //
  // public getAllUes() {
  //   return this.httpClient.get(baseUrl);
  // }

  public getUes(data) {
    let params =  new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)){
      params = params.append("id_structure", data.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(data.semestre)){
      params = params.append("semestre", data.semestre);
    }
    if (Util_fonction.checkIfNoTEmpty(data.id_option)){
      params = params.append("id_option", data.id_option);
    }
    return this.httpClient.get<any>(`${baseUrl}`, {params: params});
  }

  public getOptionsByUe(id) {
    return this.httpClient.get<any>(`${baseUrl}/${id}/options`);
  }

  public getUesByEnseignant(id) {
    return this.httpClient.get<any[]>(`${baseUrl}/enseignant/${id}`);
  }
  public getEnseignantByUes(id) {
    return this.httpClient.get(`${baseUrl}/${id}/enseignants`);
  }
  public getEnseignantByEC(idEc) {
    return this.httpClient.get(`${REST_URL}/elementConstitutifs/${idEc}/enseignants`);
  }
  //by DD
  public getEcsByEnseignant(id) {
    return this.httpClient.get(`${REST_URL}/elementConstitutifs/enseignant?id_enseignant=${id}`);
  }

  public GetEcs(body) {
    let params = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
      params = params.append("id_structure", body.id_structure)
    }
    return this.httpClient.get(REST_URL+`/elementConstitutifs`, {params: params});
  }

  public GetUesElementsConstitufis(id) {
    return this.httpClient.get(REST_URL+`/elementConstitutifs/ue/${id}`);
  }

public getDepartementUes(id) {
  return this.httpClient.get(`${baseUrl}/departement/${id}`);
}


  public getUesByCandidatSpecialite(id_specialite,id_structure) {
    let body = {
      id_specialiteCandidat:id_specialite,
      id_structure:id_structure
    };
    return this.httpClient.post(`${baseUrl}/specialite`, body);
  }

  // public deleteUes(id) {
  //   return this.httpClient.delete(`${baseUrl}/${id}`);
  // }

  public getOpions(candidat_id){
    return this.httpClient.get(`${baseUrl}/optionChoose/${candidat_id}`);
  }
// by dd
  public CalculeNotesGenerale(idUe,coeffTp,coeffDev, coeffEx,annee, session,type) {
    let body = {
      ue : {
        id : idUe
      },
      coeffTP : coeffTp,
      type:type,
      coeffDev : coeffDev,
      coeffEx : coeffEx,
      annee : annee,
      session : session
    }
    return this.httpClient.post(`${REST_URL}/notesGenerales/`, body,{responseType:'text'});
  }
  // by dd

  public CalculeNoteseltcons(idelt,coeffTp,coeffDev, coeffEx,annee, session,type) {
    let body = {
      elementConstitutif : {
        id : idelt
      },
      coeffTP : coeffTp,
      type:type,
      coeffDev : coeffDev,
      coeffEx : coeffEx,
      annee : annee,
      session : session
    }
    return this.httpClient.post(`${REST_URL}/notesGenerales`, body,{responseType:'text'});
  }
  //by DD
  listNoteCalcule(data): Observable<any> {
    // tslint:disable-next-line:max-line-length
    let id_element_constitutif;
    if (data.id_element_constitutif) {
      id_element_constitutif = `&id_element_constitutif=${data.id_element_constitutif}`;
    } else {
      id_element_constitutif = '';
    }
    let id_ue;
    if (data.id_ue) {
      id_ue = `&id_ue=${data.id_ue}`;
    } else {
      id_ue = '';
    }
    let num_etudiant;
    if (data.num_etudiant) {
      num_etudiant = `&num_etudiant=${data.num_etudiant}`;
    } else {
      num_etudiant = '';
    }
    let valid;
    let session = '';
    if (data.valid === 'tout') {
      valid = '';
      if (data.session) {
        session = `&session=${data.session}`;
      } else {
        session = '';
      }
    } else {
      valid = `&type=${data.valid}`;
    }

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(`${REST_URL}/notesGenerales${data.valid === 'tout' ? '' : '/etudiant_valid'}?annee_scolaire=${data.annee_scolaire}&page=${data.page}&size=${data.size}${id_element_constitutif}${id_ue}${session}${num_etudiant}${valid}`, {headers: HEADERS});
  }
  //by ALK
  public createUes(ues) {
    return this.httpClient.post(baseUrl, ues,{responseType: 'text'});
  }
  //by ALK
  public createEc(ec) {
    return this.httpClient.post(REST_URL+'/elementConstitutifs', ec,{responseType: 'text'});
  }
//by ALK
  public updateEC(eC,id) {
    return this.httpClient.put(`${REST_URL}/elementConstitutifs/${id}`, eC,{responseType: 'text'});
  }
  //by ALK
  public updateUE(ue) {
    return this.httpClient.put(`${baseUrl}/${ue.id}`, ue,{responseType: 'text'});
  }
  //by ALK
  public AffectUeToTeacher(data,idTeacher) {
    return this.httpClient.put(`${baseUrl}/enseignant/${idTeacher}`, data,{responseType: 'text'});
  }
  //by Paul
  public RetirerUeToTeachers(data,idUe) {
    return this.httpClient.put(`${baseUrl}/retireUe/${idUe}`, data);
  }

  //by DD
  public AffectEcToTeacher(idEc,data) {
    return this.httpClient.put(`${REST_URL}/elementConstitutifs/enseignant/${idEc}`, data,{responseType: 'text'});
  }
  //by Paul
  public RetirerEcToTeachers(data,idEc) {
    return this.httpClient.put(`${REST_URL}/elementConstitutifs/retirer/${idEc}`, data);
  }

  //by ALK
  public AffectUeToOption(data,idUe) {
    return this.httpClient.put(`${baseUrl}/add_option/${idUe}`, data,{responseType: 'text'});
  }
  //by Paul
  public RetirerUeToOption(data,idUe) {
    return this.httpClient.put(`${baseUrl}/delete_option/${idUe}`, data);
  }


  public getAllUes() {
    return this.httpClient.get(baseUrl);
  }
  //by ALK
  public getUeByTeacher(id) {
    return this.httpClient.get(`${baseUrl}/enseignant/${id}`);
  }

  //by ALK
  public deleteUes(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`,{responseType: 'text'});
  }
  //by ALK
  public deleteEC(id) {
    return this.httpClient.delete(`${REST_URL}/elementConstitutifs/${id}`,{responseType: 'text'});
  }

  //by ALouka
  public getOpionsByStructure(id){
    return this.httpClient.get(`${REST_URL}/options/structure/${id}`);
  }
  //by ALouka
  public getUesByStructure(id) {
    let param = new HttpParams();
    param = param.append("id_structure", id);
    param = param.append("page", "0");
    param = param.append("size", "1000000000");
    return this.httpClient.get<any>(`${baseUrl}`, {params:param});
  }

  //by ALouka
  public getEcsByStructure(id) {
    let param = new HttpParams();
    param = param.append("id_structure", id);
    param = param.append("page", "0");
    param = param.append("size", "1000000000");
    return this.httpClient.get<any>(`${REST_URL}`+"/elementConstitutifs", {params:param});
  }

  //by ALouka
  // public getUesByStructure(id) {
  //   return this.httpClient.get<any>(`${baseUrl}/structure/${id}`);
  // }


}
