import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CandidatService} from "../../../services/GestionEtudiants/candidat.service";

@Component({
  selector: 'ngx-candidat-infos',
  templateUrl: './candidat-infos.component.html',
  styleUrls: ['./candidat-infos.component.scss']
})
export class CandidatInfosComponent implements OnInit {
  showMore: boolean = false;
  candidatID: number = 0;
  candidatINFO;
  constructor(private routerActive: ActivatedRoute,
              private candidatService: CandidatService) { }

  ngOnInit(): void {
    this.candidatID = this.routerActive.snapshot.params.id;
      console.log(this.candidatID);
    this.getCandidat(this.candidatID);
  }

  getCandidat(candidatID){
    this.candidatService.getCandidatById(candidatID).subscribe(res => {
      console.log(res);
      this.candidatINFO = res;
    });
  }

}
