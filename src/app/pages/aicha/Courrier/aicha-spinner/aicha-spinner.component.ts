import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Courrier} from "../courrier.model";
import {MessageService, SelectItem} from "primeng/api";
import {CourrierService} from "../courrier.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {SpinnerService} from "../../spinner.service";

@Component({
  selector: 'app-aicha-spinner',
  templateUrl: './aicha-spinner.component.html',
  styleUrls: ['./aicha-spinner.component.css']
})
export class AichaSpinnerComponent implements OnInit {

  message: string = 'Loading...';

  constructor(
    public service: SpinnerService,
  ) {}


  ngOnInit() {
  }

}
