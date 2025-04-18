import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from 'rxjs';
import {HEADERS, REST_URL} from "../../../REST_URL";
import {Util_fonction} from "../../../models/util_fonction";

const url = REST_URL + "/personnelsAdministratif";
const urlNew = REST_URL + "/personnels";
const baseUrlRole = REST_URL + '/roles';
const userRoleUrl = REST_URL + "/users/updateRoles";

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
    if (Util_fonction.checkIfNoTEmpty(body.id_structure)) {
      parm = parm.append("id_structure", body.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(body.role)) {
      parm = parm.append("role", "" + body.role);
    }
    if (Util_fonction.checkIfNoTEmpty(body.id_departement)) {
      parm = parm.append("id_departement", "" + body.id_departement);
    }
    parm = parm.append("size", '5000000');
    return this.httpClient.get<any>(`${urlNew}`, {params: parm});
  }


  public getPersonnelDonnees() {
    return this.httpClient.get<any>(REST_URL + '/donneesPersonnels');
  }

  public getAdmins(id): Observable<any> {
    return this.httpClient.get<any>(`${url}/structure/${id}`);
  }

  public getPersonnelByID(id) {
    return this.httpClient.get<any>(`${urlNew}/${id}`);
  }

  public getAnneeEnCours(id): Observable<any> {
    return this.httpClient.get(REST_URL + '/annees/structure/encours/' + `${id}`, {headers: HEADERS});
  }

  public getEvaluationEnseignements(id): Observable<any> {
    return this.httpClient.get(REST_URL + '/evaluationEnseignements/structure/' + `${id}`, {headers: HEADERS});
  }

  public getEvaluationEnseignat(id): Observable<any> {
    return this.httpClient.get(REST_URL + '/evaluations/filter/' + `${id}`, {headers: HEADERS});
  }

  public get_EvaluationEnseignat(id, anne): Observable<any> {
    return this.httpClient.get(REST_URL + '/evaluations/enseignant?anneeScolaire=' + `${anne}` + '&id_enseignant=' + `${id}`, {headers: HEADERS});
  }

  public getSurveillant(id): Observable<any> {
    return this.httpClient.get(REST_URL + '/structures/surveillants/' + `${id}`, {headers: HEADERS});
  }

  /**
   * Liste des presents de l'evaluation
   * @param id
   */
  public listePresenceEvaluation(id, action: string): Observable<any> {
    if (action === "present") {
      /**Que les present**/
      return this.httpClient.get(REST_URL + '/evaluations/' + `${id}` + '/listPresence', {headers: HEADERS});
    } else {
      /** Toute la liste*/
      return this.httpClient.get(REST_URL + '/evaluations/' + `${id}` + '/listEtudiant', {headers: HEADERS});
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
    if (type === 'Ens') {
      return this.httpClient.get<any>(REST_URL + '/seances/enseignant/' + id);
    } else if (type === "All") {
      return this.httpClient.get<any>(REST_URL + '/seances/structure/' + parmBody.id_structure);
    } else {
      let param = new HttpParams();
      let link = "";

      if (type === "Opt" && Util_fonction.checkIfNoTEmpty(parmBody.id_option)) {
        link = "option/" + parmBody.id_option;
        // param = param.append("id_option",parmBody.id_option);
      }

      if (type === "Jour" && Util_fonction.checkIfNoTEmpty(parmBody.date) && Util_fonction.checkIfNoTEmpty(parmBody.id_structure)) {
        link = "structure";
        param = param.append("id_structure", parmBody.id_structure);
        param = param.append("date", parmBody.date);
      }

      return this.httpClient.get<any>(REST_URL + '/seances/' + link, {params: param});

    }
  }

  public SaveSeance(body, id): Observable<any> {
    return this.httpClient.post(REST_URL + '/seances/structure/' + id, body);
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

  public listeSurveillantEvaluation(idEvaluation: number): Observable<any> {
    return this.httpClient.get(REST_URL + '/evaluations/' + idEvaluation + '/surveillant', {headers: HEADERS});
  }

  public addSurveillantEvaluation(idEvaluation, data): Observable<any> {
    return this.httpClient.post(REST_URL + '/evaluations/' + idEvaluation + '/surveillant', data);
  }

  public createEvaluation(data: any): Observable<any> {
    return this.httpClient.post(REST_URL + '/evaluations', data, {headers: HEADERS});
  }

  public updateEvaluation(data: any, id: number): Observable<any> {
    return this.httpClient.put(REST_URL + '/evaluations/' + id, data, {headers: HEADERS});
  }

  public addPersonnel(personnel) {
    return this.httpClient.post(urlNew, personnel);
  }

  public findPersonnelById(id: number) {
    return this.httpClient.get(`${urlNew}/${id}`);
  }

  public updatePersonnel(id, personnel) {
    return this.httpClient.put(`${urlNew}/${id}`, personnel);
  }

  public updatePersonnelAccess(userID, body) {
    return this.httpClient.put(`${userRoleUrl}/${userID}`, body, {headers: HEADERS});
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
    return this.httpClient.post(REST_URL + '/emargements_enseignant', data, {responseType: 'text'});
  }

  // aicha
  public resetToDefaultPassword(data): Observable<any> {
    return this.httpClient.post(REST_URL + '/users/resetToDefault', data, {responseType: 'text'});
  }

  
  public bloqueDebloquer(idUser, status): Observable<any> {
    return this.httpClient.put(REST_URL + '/users/updateStatut/' + idUser, status, {responseType: 'text'});
  }


  //by dd
  public getEffectiviteEnseignant(data, id): Observable<any> {
    return this.httpClient.post(REST_URL + '/effectivites/' + `${id}`, data);
  }

  //by dd
  public getEffectiviteByDepartement(data): Observable<any> {
    return this.httpClient.post(REST_URL + '/effectivites/departement', data);
  }

  //by dd
  public deleteEff(id) {
    return this.httpClient.delete(`${REST_URL}/emargements_enseignant/${id}`, {responseType: 'text'});
  }

  //by dd
  public getGrades() {
    return this.httpClient.get(`${REST_URL}/gradesHeures`);
  }

  //by dd
  public getHeureDueByTeacher(id) {
    return this.httpClient.get(`${REST_URL}/heuresDues/enseignant/${id}`);
  }


  //by dd
  public AjouterGrade(data) {
    return this.httpClient.post(`${REST_URL}/gradesHeures/`, data, {responseType: 'text'});

  }

  //by dd
  public modifierGrade(data, id) {
    return this.httpClient.put(`${REST_URL}/gradesHeures/${id}`, data, {responseType: 'text'});

  }


  //by dd
  public deleteGrade(id) {
    return this.httpClient.delete(`${REST_URL}/gradesHeures/${id}`, {responseType: 'text'});
  }

  // by dd
  public getEnseignantEffectivite(dateDebut, dateFin, id): Observable<any> {
    return this.httpClient.get(REST_URL + '/emargements_enseignant?idEnseignant=' + id + '&dateDebut=' + dateDebut + '&dateFin=' + dateFin);
  }

  // by dd
  public getUserByID(id): Observable<any> {
    return this.httpClient.get<any>(REST_URL + '/users/' + id);
  }

  public addFile(id: number, file: any) {
    return this.httpClient.put(`${REST_URL}/personnels/${id}/add_files`, file);
  }


  public onUpload(data): Observable<any> {

    const formData = new FormData();
    const currentDate = new Date();

    formData.append('file', data.file);
    formData.append('annee_scolaire', (currentDate.getFullYear() - 1) + "-" + currentDate.getFullYear());
    formData.append('fileType', data.file.type);
    formData.append('file_type', data.type);
    // formData.append('owner_id', `${id}`);
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post(`${REST_URL}/files`, formData);
  }

  public onUploadPromise(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.onUpload(data).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      })
    });
  };

  public onUploadPromises(datas: any[]): Promise<any> {
    return Promise.all([...datas.map(data => this.onUploadPromise(data))])
  };


  public removeFile(id: number, file) {
    return this.httpClient.put(`${REST_URL}/personnels/${id}/remove_files`, [file]);
  }

  public getPersonnels(data: any) {

    let parm = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(data.id_structure)) {
      parm = parm.append("id_structure", data.id_structure);
    }

    if (Util_fonction.checkIfNoTEmpty(data.id_departement)) {
      parm = parm.append("id_departement", "" + data.id_departement);
    }

    if (Util_fonction.checkIfNoTEmpty(data.user_type)) {
      parm = parm.append("user_type", data.user_type);
    }

    if (Util_fonction.checkIfNoTEmpty(data.nom)) {
      parm = parm.append("nom", data.nom);
    }

    if (Util_fonction.checkIfNoTEmpty(data.prenom)) {
      parm = parm.append("prenom", data.nom);
    }
    if(data.page !== undefined && data.size !== undefined) {
      parm = parm.append("page", data.page);
      parm = parm.append("size", data.size);
    }

    return this.httpClient.get<any>(`${urlNew}`, {params: parm});

  }

}

export const userTypes: any[] = [
  {
    name: "Enseignant",
    link: "enseignants",
    value: "ENSEIGNANT",
  },
  {
    name: "Vacataire",
    link: "vacataires",
    value: "VACATAIRE",
  },
  {
    name: "Personnel administratif",
    link: "administratifs",
    value: "PERSONNEL_ADMINISTRATIF",
  },
  {
    name: "Personnel technique",
    link: "techniques",
    value: "PERSONNEL_TECHNIQUE",
  }
]
