import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HEADERS, REST_URL} from '../../pages/REST_URL';


const baseUrl = REST_URL + '/candidats';
const baseUrlPreinscription = REST_URL + '/candidat/preinscription';
const baseUrlAcademie = REST_URL + '/academies';
const baseUrlCandidatSpecialite = REST_URL + '/specialitesCandidats';
const baseUrlFiliere = REST_URL + '/filieres'; // structure/;

@Injectable({
  providedIn: 'root'
})
export class CandidatService {

  constructor(private http: HttpClient) {
  }

  public createCandidat(candidat) {
    return this.http.post(baseUrl, candidat);
  }

  public getCandidatsAnnee() {
    return this.http.get(baseUrl + '/list_annee');
  }

  public getCandidat(paramBody) {
    let params = new HttpParams();

    if(paramBody.annee !== null && paramBody.annee !== undefined && paramBody.annee !== "") { params = params.append("annee",paramBody.annee)}
    if(paramBody.nom !== null && paramBody.nom !== undefined && paramBody.nom !== ""){ params = params.append("nom",paramBody.nom)}
    if(paramBody.prenom !== null && paramBody.prenom !== undefined && paramBody.prenom !== "" ){ params = params.append("prenom",paramBody.prenom)}
    if(paramBody.numPlaceBac !== null && paramBody.numPlaceBac !== undefined && paramBody.numPlaceBac !== 0 ){ params = params.append("numPlaceBac",paramBody.numPlaceBac)}
    if(paramBody.dateDeNaissance !== null && paramBody.dateDeNaissance !== undefined && paramBody.dateDeNaissance !== "" ){ params = params.append("dateNaissance",paramBody.dateDeNaissance)}

    if(paramBody.page !== null && paramBody.page !== undefined && paramBody.page !== "" ){ params = params.append("page",paramBody.page)}
    if(paramBody.size !== null && paramBody.size !== undefined && paramBody.size !== "" ){ params = params.append("size",paramBody.size)}


    return this.http.get<any>(baseUrl, {params: params});
  }

  public verifierCandidat(nom: string, prenom: string, dateDeNaissance: string, modeAdmission: string, numPlace: number, academie: string, numAdmission: string, anneeScolaire: string) {

    const body = {
      nom: nom,
      prenom: prenom,
      dateDeNaissance: dateDeNaissance,
      modeAdmission: modeAdmission,
      numPlace: numPlace,
      academie: academie,
      numAdmission: numAdmission,
      anneeScolaire: anneeScolaire
    };

    return this.http.post(`${baseUrl}/verification`, body);
  }

  saveCandidat(body){
    return this.http.post(`${baseUrl}`, body);
  }

  public getCandidatById(id) {
    return this.http.get(`${baseUrl}/${id}`);
  }

  /** Academie */
  public getAcademies() {
    return this.http.get<any>(`${baseUrlAcademie}`);
  }

  public InsertAcademie(academie: any) {
    return this.http.post(baseUrlAcademie, academie);
  }

  public UpdateAcademie(id: number, academie: string) {
    const body ={'id': +id, 'nom': ''+academie}
    return this.http.put(baseUrlAcademie+'/'+id, body);
  }

  public deleteAcademie(id: any) {
    return this.http.delete(`${baseUrlAcademie}/${id}`);
  }

  /** Spécialité des candidats **/

  public getSepcialites() {
    return this.http.get<any>(`${baseUrlCandidatSpecialite}`);
  }
  public getSepcialitesById(id) {
    return this.http.get(`${baseUrlCandidatSpecialite}/${id}`);
  }
  public getSepcialitesByFiliereId(idFil) {
    return this.http.get(`${baseUrlFiliere}/specialiteByFiliere/${idFil}`);
  }
  public getFiliereByCandidatSepcialites(body) {/** doit être dans filiiere service**/
      return this.http.post(`${baseUrlFiliere}/specialite`,body); // {headers:HEADERS}
    }

  public InserSepcialites(specialite) {
    return this.http.post(baseUrlCandidatSpecialite, specialite);
  }

 public UpdateSepcialiteCandidat(id: number, specialite: any) {
    return this.http.put(baseUrlCandidatSpecialite+'/'+id, specialite);
  }

  public deleteSpecialite(id: any) {
    return this.http.delete(`${baseUrlCandidatSpecialite}/${id}`);
  }

  public updateModif(id,body){
    return this.http.put(`${baseUrl}/${id}`, body);
  }


  //
  //
  // public getPreRegisteredCandidateNotPaidTheRegistrationFee() {
  //   return this.http.get(`${baseUrl}/PreRegisteredCandidateNotPaidTheRegistrationFee`);
  // }
  //
  // public getPreRegisteredCandidatePaidRegistrationFee() {
  //   return this.http.get(`${baseUrl}/PreRegisteredCandidatePaidRegistrationFee`);
  // }
  //
  // public getCandidatPreisncription(nom, prenom, dateDeNaissance, modeAdmission) {
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   let params = new HttpParams()
  //     nom", nom)
  //     prenom", prenom)
  //     dateDeNaissance", dateDeNaissance)
  //     modeAdmission", modeAdmission); //Create new HttpParams
  //   return this.http.get(baseUrlPreinscription, {params: params});
  // }
  //
  // public updateCandidat(candidat) {
  //   return this.http.put(`${baseUrl}/${candidat.id}`, candidat);
  // }
  //
  // public deleteCandidat(id) {
  //   return this.http.delete(`${baseUrl}/${id}`);
  // }
  //

}
