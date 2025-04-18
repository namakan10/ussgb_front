import { Injectable } from '@angular/core';
import {REST_URL} from "../pages/REST_URL";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {_HTTP_PHOTO} from "../CONSTANTES";
import {Util_fonction} from "../pages/models/util_fonction";



const forumUrl = REST_URL+'/forum/post';
const forumPostCommentaireUrl = REST_URL+'/forum/comment';


@Injectable({
  providedIn: 'root'
})
export class ForumService {

  constructor(private http: HttpClient) {
  }

  // public getFilesByUserId(userId, annee){
  //   return this.http.get(`${baseUrl}/byOwners?idUser=${userId}&annee=${annee}`);
  // }
  public getPostWithCriteria(parameters: any) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(parameters.annee)) {
      param = param.append("annee", parameters.annee);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.date)) {
      param = param.append("date", parameters.date);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.idStructure)) {
      param = param.append("idStructure", parameters.idStructure);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.page)) {
      param = param.append("page", parameters.page);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.size)) {
      param = param.append("size", parameters.size);
    }
    if (Util_fonction.checkIfNoTEmpty(parameters.status)) {
      param = param.append("status", parameters.status);
    }

    console.log("data ==> ", parameters);
    return this.http.get<any>(`${forumUrl}`, {params: param});
  }
  //-
  public getPostCommentaires(parameters: any) {
    let param = new HttpParams();
    if (Util_fonction.checkIfNoTEmpty(parameters.idPost)) {
      param = param.append("idPost", parameters.idPost);
    }
    console.log("data ==> ", parameters);
    return this.http.get<any>(`${forumPostCommentaireUrl}`, {params: param});
  }

  public saveSubjet(body) {
    return this.http.post(`${forumUrl}`, body);
  }

  public updatePost(body) {
    return this.http.put(`${forumUrl}`, body);
  }

  public deletePost(id) {
    return this.http.delete(`${forumUrl}/`+id);
  }

  public deleteCommentaire(deleteBody) {
    return this.http.post(`${forumPostCommentaireUrl}/delete`, deleteBody);
  }

  public handleStatusPost(id, body) {
    return this.http.post(`${forumUrl}`, body);
  }


}
