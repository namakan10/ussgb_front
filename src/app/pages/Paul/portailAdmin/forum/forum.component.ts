import {Component, OnInit, ViewChild} from '@angular/core';
import {ForumService} from '../../../../services/forum.service';
import {Util_fonction} from '../../../models/util_fonction';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {PAG_SMALL_SIZE} from '../../../../CONSTANTES';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import Swal from 'sweetalert2';
import {environment} from '../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  // public Editor = ClassicEditor;
  _http = environment._HTTP;
  user = JSON.parse(sessionStorage.getItem('user'));
  dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
  PostForm: FormGroup;
  // FilterForm: FormGroup;
  body = {
    annee: null,
    content: null,
    date: null,
    status: null,
    structure: {id: null}
  };
  //-
  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'content',
    'actions'
  ];
  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 100;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(
    private formBuilder: FormBuilder,
    private forumService: ForumService) { }

  ngOnInit() {
    this.initForm();
    this.getPost();
  }

  
parseImage(img: string): string {
  if(!img) return;
  return img.includes("public.") ? "https://" + img : "http://" + img ;
}

  cutContent(element){
    console.log("element => ..", element);
    return "element.toString().substring(0, 15)+'...'";
  }
  getPost(){
    const parameters = {
      idStructure: this.user.structure.id
    };
    this.forumService.getPostWithCriteria(parameters).subscribe((data: any) => {
      data.content.forEach(d => d.titre = d.content.substring(0, 55)+' ...');
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.paginator = this.paginator;
      this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
    });
  }


  //
  showPostContent = undefined;
  showPost(element){
    this.initForm();
    this.showPostContent = element;
    $('#ShowPostContentModal').modal('show');
    $('#ShowPostContentModal').appendTo('body');
  }
  //
  PostCommentaires = undefined;
  spinner = false;
  PostData;
  async showPostComments(element){
    this.spinner = true;
    this.IDPost = element.id;
    this.PostData = element;
    await this.bindCommentaires(element);
    $('#ShowPostCommentairesModal').modal('show');
    $('#ShowPostCommentairesModal').appendTo('body');

  }

  async bindCommentaires(element){
    const body = {
      idPost: element.id
    }
    await this.forumService.getPostCommentaires(body).subscribe(postCommentaires => {
      console.log("postCommentaires ==> ", postCommentaires);
      this.PostCommentaires = postCommentaires.content;
      this.spinner = false;

    }, error => {
      this.spinner = false;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  //
  action;
  showForm = false;
  newPost(){
    this.initForm();
    this.action = 'creat';
    this.showForm = true;
    $('#PostFormModal').modal('show');
    $('#PostFormModal').appendTo('body');
  }

  savePost(){
    
    this.body.content = this.PostForm.controls.content.value;
    this.body.status = this.PostForm.controls.status.value;
    // this.body.annee = this.dateEnCours.dateEnCours;
    this.body.date = Util_fonction.convertDate(new Date());
    this.body.structure.id = this.user.structure.id;

    this.forumService.saveSubjet(this.body).subscribe(response => {
      this.getPost();
      $('#PostFormModal').modal('hide');
      Util_fonction.SuccessMessage("Sujet de forum ajouter avec succès !");
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
    });
  }

  modifPost(element){
    this.initForm();
    this.action = 'update';
    this.showForm = true;
    this.fullEditForm(element);

    $('#PostFormModal').modal('show');
    $('#PostFormModal').appendTo('body');
  }

  IDPost;
  fullEditForm(element){
    console.log("element ==> ", element);
    this.IDPost = element.id;
    this.PostForm.controls.content.setValue(element.content);
    this.PostForm.controls.status.setValue(element.status);


    $('#PostFormModal').modal('show');
    $('#PostFormModal').appendTo('body');
  }

  update_Post() {
    // this.body.content = this.PostForm.controls.content.value;
    // this.body.status = this.PostForm.controls.status.value;
    // this.body.annee = this.dateEnCours.dateEnCours;
    // this.body.date = Util_fonction.convertDate(new Date());
    // this.body.structure.id = this.user.structure.id;

    const body = {
      // annee	: this.dateEnCours.dateEnCours,
      content	: this.PostForm.controls.content.value,
      date: Util_fonction.convertDate(new Date()),
      status: this.PostForm.controls.status.value,
      structure: {id: this.user.structure.id},
      id: this.IDPost
    };

    this.forumService.updatePost(body).subscribe(res => {
      this.getPost();
      $('#PostFormModal').modal('hide');
      this.showForm = false;
      Util_fonction.SuccessMessage("sujet de forum mise à jour avec succès !");
    }, errorSpecialite => {
      Util_fonction.AlertMessage(errorSpecialite.error.status, errorSpecialite.error.message);
    });
  }

  delete_Post(element){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer ce sujet de forum ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.forumService.deletePost(element.id).subscribe(delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.getPost();
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }

  deleteBody = [];
  async deleteCommentaire(){
    Swal.fire({
      title: '',
      text: "Etes-vous sûre de vouloir supprimer les commentaire sélectionnés ? ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler!',
      confirmButtonText: 'Oui, Supprimé!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.forumService.deleteCommentaire(this.deleteBody).subscribe(async delRes=>{
          Util_fonction.SuccessMessage(delRes);
          this.deleteBody = [];
          await this.bindCommentaires(this.PostData);
        }, error =>{
          Util_fonction.AlertMessage(error.error.status,error.error.message);
        });
      }
    })

  }
  isCheckedOrNot(event){
    // this.data.type = "";
    if (event.target.name === 'allSelector'){
      this.CheckALl(event.target.checked);
    }else {
      this.CheckSing(event);
    }
  }

  several;
  CheckALl(status){
    // let element = document.getElementsByClassName('ck');
    let element = $('.ck');
    if (status){
      this.deleteBody = [];
      for (let i = 0; i < element.length; i++) {
        this.deleteBody.push({
          id: +element[i].value,
        });
        element[i].checked = status;
      }
      this.several = Object.keys(this.deleteBody).length > 1;
    } else {
      for (let j = 0; j < element.length; j++) {
        element[j].checked = status;
        this.deleteBody = this.deleteBody.filter(d => +d.id !== +element[j].value);
      }
    }
    console.log("this.deleteBody ===> ", this.deleteBody);
  }

  CheckSing(event){
    if (event.target.checked){
      this.deleteBody.push({
        id: +event.target.value,
      });
    }else {
      this.deleteBody = this.deleteBody.filter(data => {
        return +data.id !== +event.target.value && data;
      });
    }
    this.several = Object.keys(this.deleteBody).length > 1;
    console.log("this.deleteBody ===> ", this.deleteBody);
  }

  initForm() {
    this.PostForm = this.formBuilder.group({
      content: new FormControl (null, Validators.required),
      status: new FormControl (null, Validators.required)

    });
 }
  // initFilterForm(){
  //   this.FilterForm = this.formBuilder.group({
  //     annee: new FormControl (null),
  //     type: new FormControl (null),
  //     cursus: new FormControl (null)
  //   });
  // }

}
