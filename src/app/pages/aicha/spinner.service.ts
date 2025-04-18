import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

   private _loading = new BehaviorSubject<boolean>(false);

   public message$ = new BehaviorSubject<string>(null);

   public readonly loading$ = this._loading.asObservable();

  constructor() {}

  show(msg?) {
    this._loading.next(true);
    this.message$.next(msg);
  }

  hide() {
    this._loading.next(false);
    this.message$.next(null);
  }

}
