import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HEADERS, REST_URL} from "../pages/REST_URL";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  roleAs: any;
  constructor(private httpClient: HttpClient) {
  }

  authenticate(username: any, password: any) {
    let authRequest = {
      username: username,
      password: password,
    };
    return this.httpClient.post(REST_URL+'/authenticate', authRequest);
  }

  resetPassword(email: any) {
    let authRequest = {
      email: email
    };
    return this.httpClient.post(REST_URL+'/users/request/resetPassword', authRequest);
  }

  sendToken(data: any) {

    return this.httpClient.post(REST_URL+'/users/resetPassword', data);
  }

  usernameUpdate(data: any): Observable<any> {
    return this.httpClient.put(REST_URL + `/users/updateUsername`, data, {headers: HEADERS});
  }

  passwordForm(data: any): Observable<any> {
    return this.httpClient.put(REST_URL + `/users/updatePassword`, data, {headers: HEADERS});
  }

  isUserLoggedIn() {
    const user = sessionStorage.getItem('username');
    // tslint:disable-next-line:no-console
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('username');
  }

  getRole() {
    this.roleAs = JSON.parse(sessionStorage.getItem('roles'));
    return this.roleAs;
  }

  getAllUser(): Observable<any> {
    return this.httpClient.get(REST_URL + `/users`);
  }
}
