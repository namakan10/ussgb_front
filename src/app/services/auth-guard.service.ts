import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router,
              private authService: AuthService) {
  }

  /*
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.authService.isUserLoggedIn())
          return true;
      this.router.navigate(['auth/login']);
      return false;
  }*/

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }


  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.authService.isUserLoggedIn()) {
      const userRole = this.authService.getRole();
      if (route.data.role != null) {
        for (let role of userRole) {
          if (!route.data.role.includes(role.nom)) {
            this.router.navigate(['/pages/forbidden']);
            return false;
          }
        }
        return true;
      }
      return true;
    }
    //this.router.navigate(['auth/login']);
    this.router.navigate(['/pages/utilisateur/home']);
    return false;
  }

}
