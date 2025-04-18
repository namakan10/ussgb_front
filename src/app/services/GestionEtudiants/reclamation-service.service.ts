import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { REST_URL } from '../../pages/REST_URL';
const baseUrl = REST_URL+"/reclamations";

@Injectable({
  providedIn: 'root'
})
export class ReclamationServiceService {

  constructor(private http: HttpClient) { }

  public getEtudiantEvaluation(id) {
    return this.http.get<any>(REST_URL+`/evaluations/etudiant/${id}`);
  }
  public getDepartementReclamation(idDep) {
    return this.http.get<any>(baseUrl+`/departement/${idDep}`);
  }

  public addReclamation(reclamation) {
    return this.http.post(baseUrl, reclamation);
  }
  public TraitementReclamation(idReclam,Body) {
    return this.http.put(baseUrl+'/'+idReclam, Body);
  }

  public UpdateReclamation(idReclamation: number, reclamation: any) {
    return this.http.put(baseUrl+'/'+idReclamation, reclamation);
  }

  public DeleteReclamation(idReclamation: number) {
    return this.http.delete(baseUrl+'/'+idReclamation);
  }

}
