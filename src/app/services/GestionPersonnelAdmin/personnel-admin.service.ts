import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HEADERS, REST_URL} from "../../pages/REST_URL";
import { Observable } from 'rxjs';
import {Util_fonction} from "../../pages/models/util_fonction";

const url = REST_URL+"/personnelsAdministratif";
const urlNew = REST_URL+"/personnels";
const baseUrlRole = REST_URL + '/roles';
const userRoleUrl = REST_URL+"/users/updateRoles";

@Injectable({
  providedIn: 'root'
})
export class PersonnelAdminService {
    constructor(private httpClient: HttpClient) {
    }
    public getAllRoles() {
      return this.httpClient.get<any[]>(`${baseUrlRole}`);
    }

    public getStructurePersonnel(body) {
      let parm = new HttpParams();
      if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
        parm = parm.append("id_structure", body.id_structure);
      }
      if (Util_fonction.checkIfNoTEmpty(body.role)){
        parm = parm.append("role", ""+body.role);
      }
      if (Util_fonction.checkIfNoTEmpty(body.id_departement)){
        parm = parm.append("id_departement", ""+body.id_departement);
      }
      // if(body.page !== undefined && body.size !== undefined) {
        parm = parm.append("page", "0");
        parm = parm.append("size", "5000");
      // }
        return this.httpClient.get<any>(`${urlNew}`, {params: parm});
    }


    public getPersonnelDonnees() {
        return this.httpClient.get<any>(REST_URL+'/donneesPersonnels');
    }

    public getAdmins(id): Observable<any> {
        return this.httpClient.get<any>(`${url}/structure/${id}`);
    }

    public getPersonnelByID(id) {
      return this.httpClient.get<any>(`${urlNew}/${id}`);
    }

    public getAnneeEnCours(id): Observable<any> {
        return this.httpClient.get(REST_URL + '/annees/structure/encours/' + `${id}`);
    }

    public getEvaluationEnseignements(id): Observable<any> {
        return this.httpClient.get(REST_URL + '/evaluationEnseignements/structure/' + `${id}`, {headers: HEADERS});
    }

    public getEvaluationEnseignat(id): Observable<any>{
        return this.httpClient.get(REST_URL + '/evaluations/filter/' +`${id}`, {headers: HEADERS});
    }

    public get_EvaluationEnseignat(id,anne): Observable<any>{
        return this.httpClient.get(REST_URL + '/evaluations/enseignant?anneeScolaire=' +`${anne}`+'&id_enseignant='+`${id}`, {headers: HEADERS});
    }

  public getSurveillant(id): Observable<any> {
        return this.httpClient.get(REST_URL + '/structures/surveillants/' + `${id}`, {headers: HEADERS});
    }

  /**
   * Liste des presents de l'evaluation
   * @param id
   */
  public listePresenceEvaluation(id, action: string): Observable<any> {
    if (action === "present"){
      /**Que les present**/
      return this.httpClient.get(REST_URL + '/evaluations/'+`${id}`+'/listPresence', {headers: HEADERS});
    }else {
      /** Toute la liste*/
      return this.httpClient.get(REST_URL + '/evaluations/'+`${id}`+'/listEtudiant', {headers: HEADERS});
    }
  }

    public listeGroupeEvaluation(id): Observable<any> {
        return this.httpClient.get(REST_URL + '/notes/noterByGroupe/' + `${id}`, {headers: HEADERS});
    }

    public listeNonNoteEvaluation(id, presence): Observable<any> {
        return this.httpClient.get(REST_URL + `/notes/etudiantNonNote?id_evaluation=${id}&presence=${presence}`, {headers: HEADERS});
    }

    public listeNoteEvaluation(id): Observable<any> {
        return this.httpClient.get(REST_URL + '/notes/evaluation/' + `${id}`, {headers: HEADERS});
    }

    public getEtudiantGroupe(data, grouppresence): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(REST_URL + `/notes/noterByGroupeEtudiantList?id_evaluation=${data.idEvaluation}&id_groupe=${data.idGroupe}&presence=${grouppresence}`, {headers: HEADERS});
    }

    public evaluationEnseignementsAdd(data): Observable<any> {
        return this.httpClient.post(REST_URL + '/evaluationEnseignements/structure/', data, {headers: HEADERS});
    }

    public EnregistrerNoteEvaluation(id, data): Observable<any> {
        return this.httpClient.post(REST_URL + '/notes/saveNotes/' + id, data, {headers: HEADERS});
    }

    public getGroupeByStructure(data): Observable<any> {
        return this.httpClient.post(REST_URL + '/groupes/structureAnnee', data, {headers: HEADERS});
    }

    public addSeances(idStructure, data): Observable<any> {
        const link = REST_URL + '/seances/structure/' + idStructure;
        return this.httpClient.post(link, data, {headers: HEADERS});
    }

    public updateNoteEvaluation(data): Observable<any> {
        return this.httpClient.put(REST_URL + '/notes/editNote', data, {headers: HEADERS});
    }

    public getEnseignantParStructure(id): Observable<any> {
        return this.httpClient.get(REST_URL + '/enseignants/structure/' + `${id}`, {headers: HEADERS});
    }

    public getAllSeance(link, id): Observable<any> {
        return this.httpClient.get(REST_URL + '/seances' + `${link}` + `${id}`, {headers: HEADERS});
    }

    public getSeances(type, parmBody, id): Observable<any> {
      if (type ==='Ens'){
        return this.httpClient.get<any>(REST_URL + '/seances/enseignant/'+id);
      }else if (type === "All"){
        return this.httpClient.get<any>(REST_URL + '/seances/structure/'+parmBody.id_structure);
      }else {
        let param = new HttpParams();
        let link = "";

        if (type === "Opt" && Util_fonction.checkIfNoTEmpty(parmBody.id_option)){
          link = "option/"+parmBody.id_option;
          // param = param.append("id_option",parmBody.id_option);
        }

        if (type === "Jour" && Util_fonction.checkIfNoTEmpty(parmBody.date) && Util_fonction.checkIfNoTEmpty(parmBody.id_structure)){
            link = "structure";
            param = param.append("id_structure",parmBody.id_structure);
            param = param.append("date",parmBody.date);
        }

        return this.httpClient.get<any>(REST_URL + '/seances/' +link , {params: param});

      }
    }

    public SaveSeance(body, id): Observable<any> {
        return this.httpClient.post(REST_URL + '/seances/structure/'+id, body);
    }

    public deleteSeance(id): Observable<any> {
        return this.httpClient.delete(REST_URL + '/seances/' + `${id}`);
    }

    public getEnseignantParID(id) {
            return this.httpClient.get(REST_URL + '/enseignants/' + `${id}`, {headers: HEADERS});
        }

    public getUEEnseignat(id): Observable<any> {
        return this.httpClient.get(REST_URL + '/ues/enseignant/' + `${id}`, {headers: HEADERS});
    }

    public getUEStructure(id): Observable<any> {
        return this.httpClient.get(REST_URL + '/ues/structure/' + `${id}`, {headers: HEADERS});
    }

    public getSalleDispo(data: any): Observable<any> {
        return this.httpClient.post(REST_URL + '/evaluations/salleDisponibleReservation', data, {headers: HEADERS});
    }

    public listeSurveillantEvaluation(idEvaluation: number): Observable<any>{
        return this.httpClient.get(REST_URL + '/evaluations/'+idEvaluation+'/surveillant', {headers: HEADERS});
    }

    public addSurveillantEvaluation(idEvaluation,data): Observable<any>{
        return this.httpClient.post(REST_URL + '/evaluations/'+idEvaluation+'/surveillant', data);
    }

    public createEvaluation(data: any): Observable<any>{
        return this.httpClient.post(REST_URL + '/evaluations', data, {headers: HEADERS});
    }

    public updateEvaluation(data: any, id: number): Observable<any>{
        return this.httpClient.put(REST_URL + '/evaluations/' + id, data, {headers: HEADERS});
    }

    public addPersonnel(personnel){
        return this.httpClient.post(urlNew, personnel);
    }

    public updatePersonnel(id, personnel) {
      console.log(personnel);
        return this.httpClient.put(`${urlNew}/${id}`, personnel);
    }

    public updatePersonnelAccess(userID,body) {
      console.log("------ID USER");
      console.log(userID);
      console.log("------BODY");
      console.log(body);
      return this.httpClient.put(`${userRoleUrl}/${userID}`, body, {headers:HEADERS});
    }

    public deletePersonnel(id) {
        return this.httpClient.delete(`${urlNew}/${id}`);
    }

    public removeEvaluation(id): Observable<any> {
        return this.httpClient.delete(REST_URL + '/evaluations/' + id);
    }

    public removeQuestion(id): Observable<any> {
        return this.httpClient.delete(REST_URL + '/evaluationEnseignements/' + id);
    }


  //by dd
  public EmargerEnseignant(data): Observable<any> {
    return this.httpClient.post(REST_URL + '/emargements_enseignant', data, {responseType:'text'});
  }

  // aicha
  public resetToDefaultPassword(data): Observable<any> {
    return this.httpClient.post(REST_URL + '/users/resetToDefault', data, {responseType:'text'});
  }




  //by dd
  public getEffectiviteEnseignant(data,id): Observable<any> {
    return this.httpClient.post(REST_URL + '/effectivites/'+ `${id}`, data);
  }
  //by dd
  public getEffectiviteByDepartement(data): Observable<any> {
    return this.httpClient.post(REST_URL + '/effectivites/departement', data);
  }
  //by dd
  public deleteEff(id) {
    return this.httpClient.delete(`${REST_URL}/emargements_enseignant/${id}`,{responseType: 'text'});
  }

  //by dd
  public getGrades() {
    return this.httpClient.get(`${REST_URL}/parametres-heures-sup`);
  }

  //by dd
  public getHeureDueByTeacher(id) {
    return this.httpClient.get(`${REST_URL}/heuresDues/enseignant/${id}`);
  }


  //by dd
  public AjouterGrade(data) {
    return this.httpClient.post(`${REST_URL}/parametres-heures-sup`, data, {responseType: 'text'});

  }

  //by dd
  public modifierGrade(data,id) {
    return this.httpClient.put(`${REST_URL}/parametres-heures-sup/${id}`, data, {responseType: 'text'});

  }


  //by dd
  public deleteGrade(id) {
    return this.httpClient.delete(`${REST_URL}/parametres-heures-sup/${id}`,{responseType: 'text'});
  }
  // by dd
  public getEnseignantEffectivite(dateDebut,dateFin,id): Observable<any> {
    return this.httpClient.get(REST_URL + '/emargements_enseignant?idEnseignant='+id+'&dateDebut='+dateDebut+'&dateFin='+dateFin);
  }

  // by dd
  public getUserByID(id): Observable<any> {
    return this.httpClient.get<any>(REST_URL + '/users/'+id);
  }


}
