import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {REST_URL} from "../../REST_URL";

const baseUrl = REST_URL+'/courriers';

@Injectable({
  providedIn: 'root'
})
export class CourrierService {

  constructor(private httpClient: HttpClient) { }

  public create(data) {
    return this.httpClient.post(baseUrl, data);
  }

  public update(id:number,data) {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }

  public updateCourier(id:number,type:string,data) {
    return this.httpClient.put(`${baseUrl}/${type}/${id}`, data);
  }

  public delete(id:number) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  public getCourriers(id:number,etat: string,type:string,page?,size?) {
    page = page===undefined? 0:page;
    size = size===undefined? 50:size;
    return this.httpClient.get(`${baseUrl}/?etat=${etat}&id_structure=${id}&page=${page}&size=${size}&typeCourrier=${etat}`);
  }

  public getCourrierId(id:number) {
    return this.httpClient.get(`${baseUrl}/${id}`);
  }

  public getCourrierImputationId(id:number) {
    return this.httpClient.get(`${baseUrl}/imputation/${id}`);
  }

  public getCourrierByStructureId(id:number) {
    return this.httpClient.get(`${baseUrl}/structure/${id}`);
  }

  public getCourrierDepartByStructureId(id:number,page?,size?) {
  page = page===undefined? 0:page;
  size = size===undefined? 50:size;
  return this.httpClient.get(`${baseUrl}?etat=ATTENTE&id_structure=${id}&page=${page}&size=${size}&typeCourrier=DEPART`);
  }


  public findAll(id:number,page?: number, size?: number) {
    page = page === undefined ? 0 : page;
    size = size === undefined ? 50 : size;
    return this.httpClient.get(`${baseUrl}?id_structure=${id}&page=${page}&size=${size}`);
  }

  public findAllPage(idStructure:number,etat:string,typeCourrier:string,page?, size?) {
    page = page === undefined ? 0 : page;
    size = size === undefined ? 50 : size;
    if(etat==='ATTENTE') {
      return this.httpClient.get(`${baseUrl}?id_structure=${idStructure}&page=${page}&size=${size}&typeCourrier=${typeCourrier}`);
    } else {
      return this.httpClient.get(`${baseUrl}?etat=${etat}&id_structure=${idStructure}&page=${page}&size=${size}`);
    }
  }


  public getMesCourriers(etat:string) {
      return this.httpClient.get(`${baseUrl}/listMesCourriers?etat=${etat}`);
  }




  public getCourrierArriveByStructureId(id:number,page?,size?) {
    page = page===undefined? 0:page;
    size = size===undefined? 50:size;
    return this.httpClient.get(`${baseUrl}?etat=ATTENTE&id_structure=${id}&page=${page}&size=${size}&typeCourrier=ARRIVE`);
    // return this.httpClient.get(`${baseUrl}/structure/${id}?typeCourrier=ARRIVE`);
  }

  public getCourrierStatistiqueold(id_structure:number,annee:string) {
    const endPoint = `${REST_URL}/statistiques/courriers/${id_structure}?annee=${annee}`;
    return this.httpClient.get(endPoint);
  }

  public getCourrierStatistique(id:number,annee:string,global:boolean,mois:boolean,statut:boolean) {
    const endPoint = `${REST_URL}/statistiques/courriers/?id_structure=${id}&annee=${annee}&global=${global}&mois=${mois}&statut_traitement=${statut}`;
    return this.httpClient.get(endPoint);
  }


  public getCourriersStatistiquesTraitements(id:number) {
    return this.httpClient.get(`${REST_URL}/statistiques/courriersTraitement/${id}`);
  }

  public getServiceByStructureId(id:number) {
    return this.httpClient.get(`${REST_URL}/services/structure/${id}`);
  }

  public getMesCourriersImputes(id:number) {
    return this.httpClient.get(`${baseUrl}/listMesCourriers?etat=IMPUTE`);
  }

  public getCourriersImputation(id:number) {
    return this.httpClient.get(`${baseUrl}/imputation/${id}`);
  }

  public repondreCourriers(id:number,data) {
    return this.httpClient.post(`${baseUrl}/${id}/repondre`, data);
  }

  public repondreCourriersImputation(id:number,structure) {
    return this.httpClient.post(`${baseUrl}/repondre/${id}`, {structure});
  }

  public getRepondreCourriersImputation(id:number) {
    return this.httpClient.get(`${baseUrl}/reponse/${id}`);
  }

  public getCourriersByEtat(id:number, etat: string) {
    return this.httpClient.get(`${baseUrl}/etat/${id}?etat=${etat}`);
  }

  public saveImputations(data) {
    return this.httpClient.post(`${REST_URL}/imputations`, data);
  }

  public saveCourriersSortant(data) {
    return this.httpClient.post(`${baseUrl}/sortant`, data);
  }

  public updateCourriersSortant(id:number,data) {
    return this.httpClient.put(`${baseUrl}/sortant/${id}`, data);
  }

  public saveCourriersArrivee(data) {
    return this.httpClient.post(`${baseUrl}/arrivee`, data);
  }

  public saveCourriers(data,type:string) {
    return this.httpClient.post(`${baseUrl}/${type}`, data);
  }

public updateCourriersArrivee(id:number,data) {
    return this.httpClient.put(`${baseUrl}/arrivee/${id}`, data);
  }

  public updateCourriers(id:number,data,type:string) {
    return this.httpClient.put(`${baseUrl}/${type}/${id}`, data);
  }

  public onUpload(file:File) {
    const formData = new FormData();

    formData.append('file', file);
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');


    return this.httpClient.post(`${REST_URL}/files/simpleUpload/COURRIER`, formData);
    //return this.httpClient.post(`${REST_URL}/files/simpleUpload/${file.type}`, formData);
  }

  public uploadPromise(file:File) {
    let promise = new Promise((resolve, reject) => {
      this.onUpload(file)
        .subscribe(response => {
            reject(response)
          },error => {
            resolve(error.error.text);
          }
        );
    });
    return promise;
  }



  public uploadPromises(files:File[]) {
    let promises = files.map((file)=> this.uploadPromise(file));
    return Promise.all(promises);
  }


}
