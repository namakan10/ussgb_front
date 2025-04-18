import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'ngx-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
src = "../../"+environment._ASSET_IMAGE;
  constructor() {

  }

  ngOnInit(): void {
  }

}
