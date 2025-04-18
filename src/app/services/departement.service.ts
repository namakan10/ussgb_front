import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HEADERS, REST_URL} from "../pages/REST_URL";

const baseUrl = REST_URL+"/departements";

@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  constructor(private httpClient: HttpClient) {
  }
  public getStructureDepartements(id_structure) {
    return this.httpClient.get<any>(`${baseUrl}/structure/${id_structure}`);
  }

  public getDepartementByID(id_Dep) {
    return this.httpClient.get<any>(`${baseUrl}/${id_Dep}`);
  }


  public addDepartement(departement) {
    return this.httpClient.post(baseUrl,departement);
  }

  public updateDepartement(idDep, departement) {
    return this.httpClient.put(`${baseUrl}/`+idDep, departement);
  }

  public deleteDepartement(id) {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }


  // FOR SERVICES


  public getDepartementServices(id_Dep) {
    return this.httpClient.get<any>(REST_URL+`/services/departement/${id_Dep}`);
  }
  public getAllService() {
    return this.httpClient.get(REST_URL+`/services`);
  }
  public getStructureServices(id_structure) {
    return this.httpClient.get<any>(REST_URL+`/services/structure/${id_structure}`);
  }
  public AddService(serviceBody) {
    console.log(serviceBody);
    return this.httpClient.post(REST_URL+`/services`, serviceBody);
  }
  public UpdateService(id_service, serviceBody) {
    return this.httpClient.put(REST_URL+`/services/${id_service}`, serviceBody);
  }
  public DeleteService(id_service) {
    return this.httpClient.delete(REST_URL+`/services/${id_service}`);
  }


  // FOR DIVISION


  public getDivisionByService(id_service) {
    return this.httpClient.get<any>(REST_URL+`/divisions/service/${id_service}`);
  }
  public getStructureDivisions(id_structure) {
    return this.httpClient.get<any>(REST_URL+`/divisions/structure/${id_structure}`);
  }
  public getDepartementDivisions(id_Dep) {
    return this.httpClient.get<any>(REST_URL+`/divisions/departement/${id_Dep}`);
  }
  public AddDivision(divisionBody) {
    return this.httpClient.post(REST_URL+`/divisions`, divisionBody);
  }
  public UpdateDivision(id_division, divisionBody) {
    return this.httpClient.put(REST_URL+`/divisions/${id_division}`, divisionBody);
  }
  public DeleteDivision(id_division) {
    return this.httpClient.delete(REST_URL+`/divisions/${id_division}`);
  }

  // //new by Alouka
  public getDerByStructure(id) {
    return this.httpClient.get(`${baseUrl}/structure/${id}`);
  }
}
