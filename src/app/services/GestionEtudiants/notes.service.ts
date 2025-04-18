import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { REST_URL } from '../../pages/REST_URL';
import {Util_fonction} from "../../pages/models/util_fonction";

const baseUrl = REST_URL+"/releveNotes";
const baseUrl2 = REST_URL+"/scolarites/releveNotes";
const noteUrl = REST_URL+"/notesGenerales/list";
const etudiantNoteUrl = REST_URL+"/notes/etudiantNotes";
const listEcUrl = REST_URL+"/elementConstitutifs";

const uesNotInCourseUrl = REST_URL+"/notesGenerales/notInCourse";
const uesNoteGeneraleDeliberation = REST_URL+"/notesGenerales/";
const note_Url = REST_URL+"/notes";
const note_eval_Url = REST_URL+"/notes/evaluation/";


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  public getEtudiantNotes(body) {
    let param = new HttpParams();

    if (Util_fonction.checkIfNoTEmpty(body.numEtudiant)){
      param = param.append("numEtudiant", body.numEtudiant);
    }

    if (Util_fonction.checkIfNoTEmpty(body.anneeScolaire)){
      param = param.append("anneeScolaire", body.anneeScolaire);
    }

    if (Util_fonction.checkIfNoTEmpty(body.semestre)){
      param = param.append("semestre", body.semestre);
    }

    return this.http.get(`${baseUrl}`, {params:param});
    // return this.http.post(`${baseUrl}`, body);
  }

  public GetEtudiantUeNotInCourse(id_etudiant) {

    return this.http.get<any>(`${uesNotInCourseUrl}/`+id_etudiant);
  }

  public getEtudiantReleveNotes(body) {
    let param = new HttpParams();

    if (Util_fonction.checkIfNoTEmpty(body.numEtudiant)){
      param = param.append("numEtudiant", body.numEtudiant);
    }
    if (Util_fonction.checkIfNoTEmpty(body.semestre)){
      param = param.append("semestre", body.semestre);
    }

    if (Util_fonction.checkIfNoTEmpty(body.niveau)){
      param = param.append("niveau", body.niveau);
    }

    return this.http.get(`${baseUrl2}`, {params:param});
    // return this.http.post(`${baseUrl}`, body);
  }

  public GetEtudiantNote(body) {
    let param = new HttpParams();
    param = param.append("annee_scolaire", body.annee_scolaire );
    param = param.append("id_etudiant", body.id_etudiant);
    param = param.append("typeNote", body.typeNote);
    return this.http.get<any>(`${etudiantNoteUrl}/`+body.id_etudiant, {params: param});
  }

  public AttribNoteToEtudiantUEManquante(body) {
    return this.http.post<any>(`${noteUrl}`, body);
  }


  public GetDeliberationListe(body) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.annee_scolaire)){
      param = param.append("annee_scolaire", body.annee_scolaire);
    }
    if (Util_fonction.checkIfNoTEmpty(body.niveau)){
      param = param.append("niveau", body.niveau);
    }
    if (Util_fonction.checkIfNoTEmpty(body.id_option)){
      param = param.append("id_option", body.id_option);
    }
    return this.http.get<any>(`${uesNoteGeneraleDeliberation}deliberationList`, {params: param});
  }

  public AttribJuryPoint(body) {
    return this.http.post<any>(`${uesNoteGeneraleDeliberation}pointJury`, body);
  }

  public getEcsByStructure(id) {
    let param = new HttpParams();
    param = param.append("id_structure", id);
    param = param.append("page", "0");
    param = param.append("size", "1000000000");
    return this.http.get<any>(`${listEcUrl}`, {params:param});
  }

  public DeleteNote_s(body) {
    console.log("Body :: ", body);
    return this.http.delete(REST_URL+"/notes", body);
    // return this.http.post(REST_URL+-u- "/notes", body);
  }
  public DeleteNote_several(body) {
    console.log("Body :: ", body);
    return this.http.post(REST_URL+"/notesGenerales/delete", body);
    // return this.http.post(REST_URL+"/notes", body);
  }
  public DeleteSingleNoteGenerale(id) {
    return this.http.delete(REST_URL+"/notesGenerales/"+id);
  }
  public DeleteSingleNote(id) {
    return this.http.delete(REST_URL+"/notes/"+id);
  }
  public Delete_eval_note_s(evalId) {
    return this.http.delete<any>(`${note_eval_Url}${evalId}`);
  }
  public Delete_general_note_s(notes) {
    console.log("notes :: --> ", notes);
    return this.http.post<any>(REST_URL+"/notesGenerales/delete", notes);
  }

}
