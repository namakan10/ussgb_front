import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AichaHelpers {

  public static getListOthers<T>(data): T {
    return data !== null && data.hasOwnProperty('content') ? data.content : data;
  }

  public static getTotalElements(data, entites?: any[]) {
    return !data
      ? 0
      : data.hasOwnProperty('totalElements')
        ? data.totalElements
        : data.hasOwnProperty('length')
          ? data.length
          : entites
            ? entites.length
            : 0;
  }

}
