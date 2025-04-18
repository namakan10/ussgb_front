import { Component, OnInit } from '@angular/core';
//import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl,FormArray,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartementService } from '../../../services/departement.service';
import { EnseignantsService } from '../../../services/enseignants.service';
import { UesServiceService } from '../../../services/ues.service';
import {Util_fonction} from "../../../pages/models/util_fonction";
declare var $: any;


@Component({
  selector: 'app-ue-to-option',
  templateUrl: './ue-to-option.component.html',
  styleUrls: ['./ue-to-option.component.css']
})
export class UeToOptionComponent implements OnInit {

  form : FormGroup;dataform: FormGroup;
  send=[];
    search_text;
    test=[];
    sum: number=0;
  user: any;
  option:any;
  allUe:any;
  Uekeyword = 'nomUE';
  idOption: any;
    spinner = false;
    idUE;

    constructor(private teacherService: EnseignantsService,
      private route: ActivatedRoute,
      private router: Router,
      private uesService: UesServiceService,
      private derService: DepartementService,
     ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    const id =  this.user.structure.id;
   this.uesService.getUesByStructure(id).subscribe((data:any)=>{
     this.allUe=data.content;
     this.allUe.map(ue => {ue.nomUE = ue.nomUE+' '+ ue.codeUE});
   });

    this.uesService.getOpionsByStructure(id)
          .subscribe((data : any) =>{
            this.option=data;
          });
    this.form = new FormGroup({
      ue :new FormArray([])
  });
  }

    keyword = 'nom';
    selectEvent(item) {
    // do something with selected item
  //  this.addbox();
    const formdata= {
      id: item.id,
   };
   if(this.test.find(x => x.id ===item.id)){
   }else{
    this.send.push(formdata);
    this.test.push(item);
    this.test=this.test

   }
   this.sum=1;
  }


  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something
  }

remove(index,id){
//  this.removedata(index);
  this.test.splice(index,1);
  this.send.splice(index);
}

onchange(){
//   this.sum=0;
//   this.total=0;
//   const formdata= {
//     qte_achat: this.form.controls.qte_achat.value,
//  };
//   this.test.forEach((o,i) =>{
//    const qt=formdata.qte_achat[i].qte ? formdata.qte_achat[i].qte : 1;
//      this.sum= this.sum+parseInt(this.test[i].prix) *parseInt(qt);
//     this.total=parseInt(this.total)+parseInt(qt)
//     });
}
submit(){
  this.spinner = true;

  //this.idTeacher
 this.uesService.AffectUeToOption(this.send,this.idUE).subscribe(
  (data) => {
    this.spinner = false;
    Util_fonction.SuccessMessage(data);
      this.ngOnInit()
  },
  (error) => {
    this.spinner = false;
     // get the status as error.status
    Util_fonction.AlertMessage(error.error.status,error.error.message);
  })
 }

  UeSelectEvent(event){
    this.idUE = event.id;
  }
}

