import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../pages/REST_URL";
import {Util_fonction} from "../pages/models/util_fonction";

const urlAuteur = REST_URL+'/auteurs';
const urlEditeur = REST_URL+'/editeurs';
const urlGenre = REST_URL+'/genresLivres';
const urlLivre = REST_URL+'/ouvrages';
const urlLivreEmprunt = REST_URL+'/emprunts/structure';
const Urlemprunt = REST_URL+'/emprunts';

@Injectable({
  providedIn: 'root'
})
export class OuvragesService {

  constructor(private http: HttpClient) { }

  // **** AUTEUR
  add_Auteur(body){
    return this.http.post(urlAuteur, body);
  }

  UpdateAuteur(id,body){
    return this.http.put(urlAuteur+'/'+id, body);
  }

  list_auteurs(){
    return this.http.get<any>(urlAuteur);
  }


  // **** EDITEUR

  add_Editeur(body){
    return this.http.post(urlEditeur, body);
  }

  Update_Editeur(id,body){
    return this.http.put(urlEditeur+'/'+id, body);
  }

  list_Editeur(){
    return this.http.get<any>(urlEditeur);
  }


  // **** GENRE
  add_Genre(body){
    return this.http.post(urlGenre, body);
  }


  Update_Genre(id,body){
    return this.http.put(urlGenre+'/'+id, body);
  }

  list_Genre(){
    return this.http.get<any>(urlGenre);
  }
/** Suppression**/
  delete(id, type){
    if (type === 'AUTEUR'){
      return this.http.delete<any>(urlAuteur+'/'+id);
    }

    if (type === 'EDITEUR'){
      return this.http.delete<any>(urlEditeur+'/'+id);
    }
    if (type === 'GENRE'){
      return this.http.delete<any>(urlGenre+'/'+id);
    }
  }

  //************* OUVRAGE LIVRE

  GetAllOuvrage(body){
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.id_auteur)){
      param = param.append('id_auteur', body.id_auteur);
    }
    if (Util_fonction.checkIfNoTEmpty(body.id_editeur)){
      param = param.append('id_editeur', body.id_editeur);
    }
    if (Util_fonction.checkIfNoTEmpty(body.id_genre)){
      param = param.append('id_genre', body.id_genre);
    }
    if (Util_fonction.checkIfNoTEmpty(body.id_structure)){
      param = param.append('id_structure', body.id_structure);
    }
    if (Util_fonction.checkIfNoTEmpty(body.id_user)){
          param = param.append('id_user', body.id_user);
    }
    if (Util_fonction.checkIfNoTEmpty(body.titre)){
      param = param.append('titre', body.titre);
    }
    if (Util_fonction.checkIfNoTEmpty(body.type)){
      param = param.append('type', body.type);
    }
    return this.http.get<any>(urlLivre, {params: param})
  }

  add_Livre(body){
    console.log(body);
    return this.http.post(urlLivre, body);
  }
  edit_Livre(id,body){
    console.log(body);
    return this.http.put(urlLivre+'/'+id, body);
  }

  deleteLivre(id) {
    return this.http.delete(urlLivre + '/' + id);
  }


  //EMPRUNT
  GetAllStructureEmprunt(body){
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(body.id)){
      param = param.append('id', body.id);
    }
    if (Util_fonction.checkIfNoTEmpty(body.statut)){
      param = param.append('statut', body.statut);
    }
    return this.http.get<any>(urlLivreEmprunt +"/"+body.id, {params: param})
  }

  add_emprunt(body){
    return this.http.post(Urlemprunt, body);
  }

}
