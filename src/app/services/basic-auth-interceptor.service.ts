import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {_HTTP_PHOTO} from "../CONSTANTES";

@Injectable({
    providedIn: 'root'
})
export class BasicAuthInterceptorService implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // recuperation du token stocker dans une sessionStorage
        const token: string = sessionStorage.getItem('token');
        // si il ya un token on clone la requete et on envoi un header qui Autorise l'execution de la requette
    // && !request.url.includes(_HTTP_PHOTO)
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                  'Access-Control-Allow-Origin': '*',
                  'X-Custom-Header': "ProcessThisImmediately",
                }
            });
        }
        return next.handle(request);
        /*
        return next.handle(authReq).do(
            (err: any) => {
              if (err instanceof HttpErrorResponse) {

                if (err.status === 401) {
                  this.router.navigate(['user']);
                }
              }
            }
          );
        * */
    }
}
