import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { REST_URL } from '../../pages/REST_URL';
import {Util_fonction} from "../../pages/models/util_fonction";

const baseUrl = REST_URL+'/etudiants';
const baseUrlDemande = REST_URL+'/demandesEtudiant';
const baseUrltransfer = REST_URL+'/transfers';
const baseUrlReInscription = REST_URL+'/reInscriptions';
const baseUrlReInscriptionAncienFST = REST_URL+'/preInscriptions/reInscription';




@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  constructor(private http: HttpClient) { }

  public getEtudiantReclamation(id) {
    return this.http.get<any>(baseUrl+`/reclamations/${id}`);
  }

  public getEtudiantTransfert(path, data) {
    return this.http.post<any>(baseUrlDemande+`/${path}`, data);
  }

  public changeDateExpiration(path, data) {
    return this.http.post<any>(baseUrl + `/${path}`, data);
  }

  public saveEtudiantExterneTransfert(data) {
    return this.http.post<any>(baseUrltransfer, data);
  }

  public getEtudiantByID(id) {
    return this.http.get<any>(baseUrl+`/${id}`);
  }

  // public GetEtudiant_s(body) {
  //
  //   return this.http.get<any>(baseUrl+`/aa`);
  // }
  public getEtudiant_UEs(id) {
    return this.http.get<any>(baseUrl+`/ues/${id}`);
  }
  public ParcoursEtudiant(id) {
    return this.http.get<any>(baseUrl+`/parcours/${id}`);
  }

  /***
   *
   * @param annee
   * @constructor
   */
  public ChangePasswords(annee) {
    // let param = new HttpParams();
    // param = param.append("anneeScolaire", annee);
    return this.http.post(baseUrl + '/resetPassword', annee);
  }

  /**
   * POUR LA FSEG
   * @param body
   * @param fileBody
   * @constructor
   */
  public SaveReInscription(body, fileBody) {
    let datacontant = JSON.stringify(body);
    const fd = new FormData();
    fd.append("preInscriptionString", datacontant);
    fd.append("id_photo",fileBody.id_photo);

    return this.http.post(baseUrlReInscription, fd);
  }


  /**
   * POUR LA FST
   * @param body
   * @param fileBody
   * @constructor
   */
  public SaveFstAncienReInscription(body, fileBody) {
    let datacontant = JSON.stringify(body);
    const fd = new FormData();
    fd.append("preInscriptionString", datacontant);
    fd.append("id_photo",fileBody.id_photo);

    return this.http.post(baseUrlReInscriptionAncienFST, fd);
  }

  public getEtudiantByNumEtudiant(body) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.numEtudiant)){
      param = param.append("numEtudiant", body.numEtudiant);
    }
    if (Util_fonction.checkIfNoTEmpty(body.anneeScolaire)){
      param = param.append("anneeScolaire", body.anneeScolaire);
    }
    return this.http.get<any>(baseUrl, {params: param});
  }



  public UpdateEtudiantInfo(idEtudiant, body) {
    return this.http.put(baseUrl+`/${idEtudiant}`, body);
  }

  public GeneratQRcode(body) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.numEtudiant)){
      param = param.append("numEtudiant", body.numEtudiant);
    }
    if (Util_fonction.checkIfNoTEmpty(body.typeDocument)){
      param = param.append("typeDocument", body.typeDocument);
    }

    if (Util_fonction.checkIfNoTEmpty(body.anneeObtentionDiplome)){
      param = param.append("anneeObtentionDiplome", body.anneeObtentionDiplome);
    }

    if (Util_fonction.checkIfNoTEmpty(body.semestre)){
      param = param.append("semestre", body.semestre);
    }

    return this.http.post(baseUrl+"/generateQrCode", body,{params: param});
  }

  getEtudiant_s(body?: any){
    if (Util_fonction.checkIfNoTEmpty(body)){
      let param = new HttpParams();
      if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
        param = param.append("id_structure", body.id_structure);
      }
      if (Util_fonction.checkIfNoTEmpty(body.anneeScolaire)){
        param = param.append("anneeScolaire", body.anneeScolaire);
      }
      if (Util_fonction.checkIfNoTEmpty(body.codeFiliere)){
        param = param.append("codeFiliere", body.codeFiliere);
      }
      if (Util_fonction.checkIfNoTEmpty(body.codeOption)){
        param = param.append("codeOption", body.codeOption);
      }
      if (Util_fonction.checkIfNoTEmpty(body.niveau)){
        param = param.append("niveau", body.niveau);
      }
      if (Util_fonction.checkIfNoTEmpty(body.nom)){
        param = param.append("nom", body.nom);
      }
      if (Util_fonction.checkIfNoTEmpty(body.numEtudiant)){
        param = param.append("numEtudiant", body.numEtudiant);
      }
      if (Util_fonction.checkIfNoTEmpty(body.prenom)){
        param = param.append("prenom", body.prenom);
      }
      if (Util_fonction.checkIfNoTEmpty(body.id_groupe)){
        param = param.append("id_groupe", body.id_groupe);
      }
      if (Util_fonction.checkIfNoTEmpty(body.id_classe)){
        param = param.append("id_classe", body.id_classe);
      }
      if (Util_fonction.checkIfNoTEmpty(body.id_option)){
        param = param.append("id_option", body.id_option);
      }
      if (Util_fonction.checkIfNoTEmpty(body.statut)){
        param = param.append("statut", body.statut);
      }
        param = param.append("page", "0");
        param = param.append("size", "1000000");
        return this.http.get<any>(baseUrl,{params: param});
    } else {
      // TOUTS LES ETUDIANT
      return this.http.get<any>(baseUrl);
    }
  }

  getEtudiantNonInscrit(body?: any){
      let param = new HttpParams();
      if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
        param = param.append("id_structure", body.id_structure);
      }
      if (Util_fonction.checkIfNoTEmpty(body.annee_etudiant)){
        param = param.append("annee_etudiant", body.annee_etudiant);
      }
      if (Util_fonction.checkIfNoTEmpty(body.annee_inscription)){
        param = param.append("annee_inscription", body.annee_inscription);
      }
      if (Util_fonction.checkIfNoTEmpty(body.codeFiliere)){
        param = param.append("codeFiliere", body.codeFiliere);
      }
      if (Util_fonction.checkIfNoTEmpty(body.codeOption)){
        param = param.append("codeOption", body.codeOption);
      }
      if (Util_fonction.checkIfNoTEmpty(body.niveau)){
        param = param.append("niveau", body.niveau);
      }
      if (Util_fonction.checkIfNoTEmpty(body.nom)){
        param = param.append("nom", body.nom);
      }
      if (Util_fonction.checkIfNoTEmpty(body.numEtudiant)){
        param = param.append("numEtudiant", body.numEtudiant);
      }
      if (Util_fonction.checkIfNoTEmpty(body.prenom)){
        param = param.append("prenom", body.prenom);
      }
      if (Util_fonction.checkIfNoTEmpty(body.id_groupe)){
        param = param.append("id_groupe", body.id_groupe);
      }
      if (Util_fonction.checkIfNoTEmpty(body.id_classe)){
        param = param.append("id_classe", body.id_classe);
      }
      if (Util_fonction.checkIfNoTEmpty(body.id_option)){
        param = param.append("id_option", body.id_option);
      }
      if (Util_fonction.checkIfNoTEmpty(body.statut)){
        param = param.append("statut", body.statut);
      }
      if (Util_fonction.checkIfNoTEmpty(body.telephone)){
        param = param.append("telephone", body.telephone);
      }
        param = param.append("page", "0");
        param = param.append("size", "1000000");
        return this.http.get<any>(baseUrl + '/non_inscrits', {params: param});
  }



  //AICHA DEV : Modification du mot de passe de l'etudiant
  public updatePasswords(data) {
    return this.http.put(REST_URL+'/users/updatePassword', data);
  }

  //AICHA DEV : classement des etudiants
  public getClassementEtutiants(annee: string,idOption:number,niveau: string) {
    return this.http.get(`${baseUrl}/classement?annee=${annee}&idOption=${idOption}&niveau=${niveau}`);
  }

  public getEtutiants(annee: string,idOption:number,niveau: string,page?,size?) {
    page = page===undefined? 0:page;
    size = size===undefined? 1500000:size;
    return this.http.get(`${baseUrl}/?anneeScolaire=${annee}&idOption=${idOption}&niveau=${niveau}&page=${page}&size=${size}`);
  }
  public resetStudentPassword(body) {
    return this.http.post(baseUrl + "/resetPassword", body);
  }

  public getOptionsByStructureId(id:number) {
    return this.http.get(`${REST_URL}/options/structure/${id}`);
  }

  public GetClasseEtudiants(id:number) {
    return this.http.get<any>(`${REST_URL}/classes/etudiants/${id}`);
  }

}
