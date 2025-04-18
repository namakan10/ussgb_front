import {Component, Input, OnInit} from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';


@Component({
  selector: 'app-aicha-view',
  templateUrl: './aicha-view.component.html',
  styleUrls: ['./aicha-view.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class AichaViewComponent implements OnInit {


  @Input() label: string;

  @Input() value: string;

  constructor() {}

  ngOnInit() {

  }


}
