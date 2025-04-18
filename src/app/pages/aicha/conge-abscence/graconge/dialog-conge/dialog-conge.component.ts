import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";



@Component({
  selector: 'app-dialog-conge',
  templateUrl: './dialog-conge.component.html',
  styleUrls: ['./dialog-conge.component.css']
})
export class DialogCongeComponent implements OnInit {


  // @ViewChild('htmlData') htmlData:ElementRef;
  value:any;
  now = Date.now();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('MAT_DIALOG_DATA', data)
    this.value=data;
  }

  ngOnInit() {
  }


  public openPDF():void {
    let DATA = document.getElementById('htmlData');

    html2canvas(DATA).then(canvas => {

      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, 0, fileWidth, fileHeight)

      PDF.save('Decision.pdf');
    });
  }

  getDateRetour() {
    const  day = this.value.dateRetour[2] + 1;
    const  month = this.value.dateRetour[1];
    const  year = this.value.dateRetour[0];
    return new Date(year,month,day);
  }

}
