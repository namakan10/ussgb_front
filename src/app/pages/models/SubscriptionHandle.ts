import {Subscription} from "rxjs";

export class SubscriptionHandle {
    private _sub = [];

    set addToSubcription (subcrip: Subscription) {
        this._sub.push(subcrip);
    }

    dispose(){
        this._sub.forEach(sb => sb.unsubscribe());
    }
}