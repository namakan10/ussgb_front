import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-livre-detail',
  templateUrl: './livre-detail.component.html',
  styleUrls: ['./livre-detail.component.css']
})
export class LivreDetailComponent implements OnInit {
@Input() BookDatas;



// BookData: any;
  constructor() { }

  ngOnInit() {
    // this.BookDatas = this.BookData;
    // console.log(this.BookDatas);
  }

}
