import { Component, OnInit } from '@angular/core';
import {UNIV_NAME, UNIV_SIGLE} from "../../CONSTANTES";

@Component({
  selector: 'ngx-candidature',
  templateUrl: './candidature.component.html',
  styleUrls: ['./candidature.component.scss']
})
export class CandidatureComponent implements OnInit {
  univ_name = UNIV_NAME;
  univ_sigle= UNIV_SIGLE;
  constructor() { }

  ngOnInit(): void {
  }

}
