import { Injectable } from "@angular/core";
import { REST_URL } from "../pages/REST_URL";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { _HTTP_PHOTO } from "../CONSTANTES";

const baseUrl = REST_URL + "/files";
const baseUrlReInscription = REST_URL + "/reInscriptions/file";

@Injectable({
  providedIn: "root",
})
export class FilesService {
  constructor(private http: HttpClient) {}

  public getFilesByUserId(userId, annee) {
    return this.http.get(`${baseUrl}/byOwners?idUser=${userId}&annee=${annee}`);
  }

  public uploadFile(file, fileUploadInformation: string) {
    let headers = new Headers();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");
    return this.http.post(`${baseUrl}/${fileUploadInformation}`, file);
  }
  public uploadStructureLogo(file) {
    return this.http.post(`${baseUrl}/simpleUpload/LOGO`, file);
  }

  public fetchPhotoUrl(photo) {
    let response;
    let headers = new HttpHeaders();
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("X-Custom-Header", "application/json");

    // fetch(_HTTP_PHOTO+image,
    //   {headers: headers})
    //   .then(function(data){
    //     return data.blob();
    //   })
    //   .then(function(img){
    //     response = URL.createObjectURL(img);
    //   })

    // return response;
    return this.http.get<any>(_HTTP_PHOTO + photo, { headers: headers });
    // return this.http.get<any>(`${url}`);
  }

  // public fetchPhotoUrl(url) : Observable<any> {
  //   return this.http.get(`${url}`)
  //     .map((res: Response) => res.json())
  //     .catch((err: any) => Observable.throw(err || 'server error'));
  // }

  public uploadLivreImage(file) {
    return this.http.post(`${baseUrl}/simpleUpload/AUTRE`, file);
  }

  public uploadPhotoLogo(file) {
    return this.http.post(`${baseUrl}/simpleUpload/ID_PHOTO`, file);
  }

  public UpdatePhotoUSER(file, idUser) {
    return this.http.put(`${baseUrl}/updateUsersProfilePics/${idUser}`, file);
  }

  public SendeStudentFile(idStructure, idOption, file) {
    const fd = new FormData();
    fd.append("idStructure", idStructure);
    fd.append("idOption", idOption);
    fd.append("file", file);
    return this.http.post(`${baseUrlReInscription}`, fd);
  }

  public SendInscriptionFiles(idStructure, idOption, file) {
    const fd = new FormData();
    fd.append("idStructure", idStructure);
    fd.append("idOption", idOption);
    fd.append("file", file);
    return this.http.post(`${baseUrlReInscription}`, fd);
  }

  public uploadImage(file) {
    return this.http.post(`${baseUrl}/simpleUpload/AUTRE`, file);
  }

  public SendNotesFile(file, action?, nbrEc?) {
    let url ="load_mark_excel";
    const fd = new FormData();
    fd.append("file", file);
    if(!!action && action === 'ec'){
      fd.append("nbrEc", nbrEc);
      url = "load_mark_ec_excel";
    }
 
    return this.http.post(`${REST_URL}/notesGenerales/${url}`, fd);
  }
}
