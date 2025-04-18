
import {HttpHeaders} from '@angular/common/http';

import {environment} from "../../environments/environment";

// export const REST_URL = 'http://161.97.143.133:8080/usttb'; // -- online
export const REST_URL = environment.REST_URL; // -- local commun


let token = '';
if (sessionStorage.getItem('token') !== null) {
  token = sessionStorage.getItem('token');
}

export const HEADERS = new HttpHeaders().set('Authorization', `Bearer ${token}`);

export let structureSelected = {etat: false, Data: null};

