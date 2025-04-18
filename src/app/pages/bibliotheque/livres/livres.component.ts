import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OuvragesService} from "../../../services/ouvrages.service";
declare var $: any;
import {MatTableDataSource} from "@angular/material/table";
import Swal from "sweetalert2";
import {FilesService} from "../../../services/files.service";
import {MatChip} from "@angular/material/chips";
// import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ObjectUnsubscribedError, Observable} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";
import {map, startWith} from "rxjs/operators";
import {Util_fonction} from "../../models/util_fonction";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {EtudiantService} from "../../../services/GestionEtudiants/etudiant.service";
import {EnseignantsService} from "../../../services/enseignants.service";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {log} from "util";
import * as Util from "util";
import {ActivatedRoute, Router} from "@angular/router";
import {StructureService} from "../../../services/structure.service";
import {AuthService} from '../../../services/auth.service';
import { PAG_MIDLE_SIZE, PAG_SMALL_SIZE } from '../../../CONSTANTES';

@Component({
  selector: 'app-livres',
  templateUrl: './livres.component.html',
  styleUrls: ['./livres.component.css']
})
export class LivresComponent implements OnInit {

  SearchForm: FormGroup;
  NewLivreForm: FormGroup;
  keyword = 'nom';
  addBody = {
    type: null,
    titre: null,
    description: null, //"string",
    dateDePublication: null, //"string",
    langue: null, //"string",
    nbreExemplaireTotal: null,
    // nbreExemplaireDisponible: null,
    image: null, //"string",
    nbrePage: null,
    disponibilite: null, //"string",
    isbnIssn: null, //"string",
    auteurs: [],
    genreLivre: null,
    editeur: null,
    journal: null,
    structure: {
      id: null
    },
    users: []
  }
  editBody = {
    type: null,
    titre: null,
    auteurs: [],
    dateDePublication: null, //"string",
    description: null, //"string",
    disponibilite: null, //"string",
    editeur: null,
    genreLivre: null,
    image: null, //"string",
    isbnIssn: null, //"string",
    langue: null, //"string",
    // nbreExemplaireDisponible: null,
    nbreExemplaireTotal: null,
    nbrePage: null,
    journal: null,
    structure: {
      id: null
    },
    users: []
  }
  ListBody = {
    type: null,
    titre: null,
    id_structure: null,
    id_user: null,
    id_auteur: null,
    id_editeur: null,
    id_genre: null
  }

  user: any;
  IdStructure: any;
  GenresList: any;
  AuteursList: any;
  EditeursList: any;
  imageOuvrage: any;
  action: any;
  editID : any;
  BookData : any;
  Etudiants : any;
  Enseignants : any;

  Spinner = false;
  roleBiblio = false;
  ImageSelectEvent = false;
  showLivreDetail = false;
  auteurValidatorInvalid:boolean = true;
  search_spinner = false;

  UpoloadFile: File;

  visible = true;
  selectable = true;

  fruits: string[] = [];
  allAuteurs: string[] = [];

  dataSource= new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'check',
    'Image',
    'Type',
    'Titre',
    'Auteur',
    'Editeur',
    'Journal',
    'actions'
  ];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageSize = PAG_SMALL_SIZE;
  pageSizeOptions = [PAG_SMALL_SIZE];
  length = 0;
  GetBody = {
    id_structure: null,
    role: null
  }


  enseignantControl = new FormControl();
  etudiantControl = new FormControl();
  genreControl = new FormControl();
  editeurControl = new FormControl();

  EnseignantOptions: Observable<any>;
  EtudiantOptions: Observable<any>;
  GenreOptions: Observable<any>;
  EditeurOptions: Observable<any>;

  // @ViewChild('auto',{static: true}) matAutocomplete: MatAutocomplete;
  constructor(private formbuilder : FormBuilder,
              private ouvragesService: OuvragesService,
              private userService: AuthService,
              private router: Router,
              private etudiantService: EtudiantService,
              private structureService: StructureService,
              private personnelAdminService: PersonnelAdminService,
              private fileService: FilesService) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    for (let rol of this.user.users.roles){
      if (rol.nom === 'ROLE_BIBLIOTHECAIRE'){
        this.roleBiblio = true;
      }
    }
    this.IdStructure = this.user.structure.id;
  }


  ngOnInit() {
    this.initForm();
    this.initNewLivreForm();
    this.getGenres();
    this.getAuteurs();
    this.getEditeurs();
    this.getAllUsers();
    // this.getEtudiants();
    this.getEnseignants();
    this.getUserEmprunt();
    this.GetStuctureAnnees();
    // this.getOuvrage();

    this.EnseignantOptions = this.enseignantControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'object' && value.hasOwnProperty("user") ? value.user.prenom : value),
        map(enseignant => enseignant ? this.Enseignant_filter(enseignant) : this.Enseignants)
      );
    this.GenreOptions = this.genreControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'object' ? value.nom : value),
        map(genre => genre ? this.Genre_filter(genre) : this.GenresList)
      );

    this.EditeurOptions = this.editeurControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'object' ? value.nom : value),
        map(editeur => editeur ? this.Editeur_filter(editeur) : this.EditeursList)
      );

    
  }

  hendleBook(){
    this.router.navigate(['Biliotheque/gestionOvrages']);
  }
  StructureAnnees: any;
  GetStuctureAnnees(){
    this.structureService.getStuctureAnnees(this.user.structure.id)
      .subscribe(res => {
        this.StructureAnnees = res;
      })
  }

  getGenres(){
    this.ouvragesService.list_Genre().subscribe(list => {
      this.GenresList = list;
      
    });
  }

  getAuteurs(){
    this.ouvragesService.list_auteurs().subscribe(listAuthor => {
      this.AuteursList = listAuthor;
      for (let auth of listAuthor){
        this.allAuteurs.push(auth.nom);
      }

      
      
    });

  }

  getEditeurs(){
    this.ouvragesService.list_Editeur().subscribe(list => {
      this.EditeursList = list;
    });
  }
  AllUsers;
  getAllUsers(){
    this.userService.getAllUser().subscribe(users => {
      this.AllUsers = users.content.filter(ev => ev.user.typeUtilisateur === "VACATAIRE" || ev.user.typeUtilisateur === "ENSEIGNANT")

      this.AllUsers = users;
    });
  }

  getEtudiants(annee){
    console.log("annee =Etud => ", annee);
    
    this._spinner = true;
    this.Etudiants = [];
    const body = {
      id_structure: this.user.structure.id,
      anneeScolaire: annee ,
    }
    this.etudiantService.getEtudiant_s(body).subscribe(
      res =>{
        this.Etudiants = res.content;
        console.log("this.Etudiants res content -> ", this.Etudiants);
        this.Etudiants.map(o => {o.nom = "["+o.user.numMatricule+"] "+o.prenom+" "+o.nom});
        console.log("this.Etudiants -> ", this.Etudiants);
        
        this._spinner = false;
      }, error => {
        this._spinner = false;
        Util_fonction.AlertMessage(error.error.status, error.error.message);
      });
  }

  getEnseignants(){
    this.GetBody.role = "ROLE_ENSEIGNANT";
    this.GetBody.id_structure = this.user.structure.id;
    this.personnelAdminService.getStructurePersonnel(this.GetBody).subscribe(EnseignantListRes => {
      this.Enseignants = EnseignantListRes.content;
      

    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message)

    });
  }

  userEmprunt;
  UserEmprunts;
  private getUserEmprunt() {
    const body = {
      id_structure: this.user.structure.id,
      // role: null
    }
    this.personnelAdminService.getStructurePersonnel(body).subscribe(resPonse => {
      this.UserEmprunts = resPonse.content;
      this.UserEmprunts.map(o => {o.nom = "["+o.user.numMatricule+"] "+o.prenom+" "+o.nom+" / nom utilisateur: ["+o.user.username+"] tel : "+o.user.telephone});
      
    }, error => {
      Util_fonction.AlertMessage(error.error.status, error.error.message)

    });
  }

  getOuvrage(){
    this.search_spinner = true
    this.ListBody.id_structure = this.user.structure.id;
    this.ListBody.type = this.SearchForm.controls.searchType.value;
    this.ListBody.titre = this.SearchForm.controls.titre.value;
    this.ListBody.id_auteur = this.SearchForm.controls.id_auteur.value;
    this.ListBody.id_editeur = this.SearchForm.controls.id_editeur.value;
    this.ListBody.id_genre = this.SearchForm.controls.id_genre.value;
    this.ouvragesService.GetAllOuvrage(this.ListBody).subscribe(listLivres => {
      // this.dataSource = new MatTableDataSource(listLivres.content);
      // this.dataSource.paginator = this.paginator;


      this.dataSource = new MatTableDataSource(listLivres.content);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.pageSizeOptions =  Util_fonction.paginatSequence2(PAG_SMALL_SIZE, listLivres.totalElements);
        this.pageSizeOptions =  Util_fonction.paginatSequence(PAG_SMALL_SIZE, this.dataSource.data);
        this.length = listLivres.totalElements

      this.search_spinner = false;
      
    });
  }

  /**
   * Chargement du formulaire selon le type d'ouvravre
   * @constructor
   */
  articleIsChoose: boolean = false;
  memoireIsChoose: boolean = false;
  livreIsChoose: boolean = false;
  TypeChange(typeOuvrage){
    this.initNewLivreForm();
    let type = typeOuvrage; // this.NewLivreForm.controls.typeOuvrage.value;
    if (type === 'ARTICLE'){
      // Professeur
      this.articleIsChoose = true;

      this.NewLivreForm.controls.teacher.setValidators([Validators.required])
      this.NewLivreForm.controls.teacher.updateValueAndValidity();

      this.NewLivreForm.controls.journal.setValidators([Validators.required])
      this.NewLivreForm.controls.journal.updateValueAndValidity();

      this.NewLivreForm.controls.disponibilite.setValue('EN_LECTURE');
      this.NewLivreForm.controls.nbreExemplaireTotal.setValue('1');

    }else if (type === 'MEMOIRE'){
      // Etudiant
      this.memoireIsChoose = true;

      this.NewLivreForm.controls.teacher.setValidators([Validators.required])
      this.NewLivreForm.controls.teacher.updateValueAndValidity();

      this.NewLivreForm.controls.student.setValidators([Validators.required])
      this.NewLivreForm.controls.student.updateValueAndValidity();

      this.NewLivreForm.controls.disponibilite.setValue('EN_LECTURE');
      this.NewLivreForm.controls.nbreExemplaireTotal.setValue('1');
      // this.getEtudiants();

    } else {
      // cas d'un LIVRE
      this.livreIsChoose = true;

      this.NewLivreForm.controls.editeur.setValidators([Validators.required])
      this.NewLivreForm.controls.editeur.updateValueAndValidity();

      this.NewLivreForm.controls._auteur.setValidators([Validators.required])
      this.NewLivreForm.controls._auteur.updateValueAndValidity();

      this.NewLivreForm.controls.genre.setValidators([Validators.required])
      this.NewLivreForm.controls.genre.updateValueAndValidity();

      this.NewLivreForm.controls.isbnIssn.setValidators([Validators.required])
      this.NewLivreForm.controls.isbnIssn.updateValueAndValidity();

      this.NewLivreForm.controls.nbreExemplaireTotal.setValidators([Validators.required])
      this.NewLivreForm.controls.nbreExemplaireTotal.updateValueAndValidity();
    }
    this.NewLivreForm.controls.typeOuvrage.setValue(type);
    // this.getAuteurs();
    this.plusLivre();


  }
  _spinner: boolean = false;
  changeEtudiantAnnee(event){
    
    
    this.getEtudiants(event.target.value);
  }

  showDetail(livre){
    this.BookData = livre;
    this.showLivreDetail = true;
  }

  userSelectEvent(event){
    
    
    this.userEmprunt = event;
  }

  plusLivre() {
    this.action = 'new';
    this.auteurValidatorInvalid = true;
    this.ImageSelectEvent = false;
    this.fruits = [];
    $('#NewLivreFormModal').modal('show');
    $('#NewLivreFormModal').appendTo('body');
  }

  OptionSelected;
  EtudiantSelectEvent(data){
    
    this.OptionSelected = data
    this.NewLivreForm.controls.student.setValue(data.user.id);
  }

  /**
   * Launch EDITION
   * @param livre
   * @constructor
   */
  EditLivre(livre) {
    console.log("livre ==> ", livre);
    
    this.editID = livre.id;
    this.fruits = [];
    this.action = 'edit';
    this.ImageSelectEvent = false;

    //---------------------------------------------------

    this.initNewLivreForm();
    let type = livre.type; // this.NewLivreForm.controls.typeOuvrage.value;
    if (type === 'ARTICLE'){
      // Professeur
      this.articleIsChoose = true;

      this.NewLivreForm.controls.teacher.setValidators([Validators.required])
      this.NewLivreForm.controls.teacher.updateValueAndValidity();

      this.NewLivreForm.controls.journal.setValidators([Validators.required])
      this.NewLivreForm.controls.journal.updateValueAndValidity();

      this.NewLivreForm.controls.disponibilite.setValue('EN_LECTURE');
      this.NewLivreForm.controls.nbreExemplaireTotal.setValue('1');
      this.getEnseignants();


    }else if (type === 'MEMOIRE'){
      // Etudiant
      this.memoireIsChoose = true;

      // this.getEtudiants();
      this.getEnseignants();

      this.NewLivreForm.controls.teacher.setValidators([Validators.required])
      this.NewLivreForm.controls.teacher.updateValueAndValidity();

      this.NewLivreForm.controls.student.setValidators([Validators.required])
      this.NewLivreForm.controls.student.updateValueAndValidity();

      this.NewLivreForm.controls.disponibilite.setValue('EN_LECTURE');
      this.NewLivreForm.controls.nbreExemplaireTotal.setValue('1');

      // for (let u of livre.users){
      //   if (u.typeUtilisateur === 'ENSEIGNANT'){
      //     this.enseignantControl.setValue(livre.users.prenom);
      //   } else {
      //     this.etudiantControl.setValue(livre.users.prenom);
      //   }
      // }
      // this.Etudiant_filter(livre.users.

    } else {
      // cas d'un LIVRE
      this.livreIsChoose = true;

      this.NewLivreForm.controls.editeur.setValidators([Validators.required])
      this.NewLivreForm.controls.editeur.updateValueAndValidity();

      this.NewLivreForm.controls._auteur.setValidators([Validators.required])
      this.NewLivreForm.controls._auteur.updateValueAndValidity();

      this.NewLivreForm.controls.genre.setValidators([Validators.required])
      this.NewLivreForm.controls.genre.updateValueAndValidity();

      this.NewLivreForm.controls.isbnIssn.setValidators([Validators.required])
      this.NewLivreForm.controls.isbnIssn.updateValueAndValidity();

      this.NewLivreForm.controls.nbreExemplaireTotal.setValidators([Validators.required])
      this.NewLivreForm.controls.nbreExemplaireTotal.updateValueAndValidity();
    }
    this.NewLivreForm.controls.typeOuvrage.setValue(type);
//---------------------------------------------------

    let auth = [];
    for (let at of livre.auteurs){
      auth.push(at.nom);
    }
    this.NewLivreForm.controls._auteur.setValue(auth);

    if (Util_fonction.checkIfNoTEmpty(livre.editeur)){
      this.NewLivreForm.controls.editeur.setValue(livre.editeur.nom);
      this.editeurControl.setValue(livre.editeur);
    }

    if (Util_fonction.checkIfNoTEmpty(livre.editeur)){
      this.NewLivreForm.controls.genre.setValue(livre.genreLivre.nom);
      this.genreControl.setValue(livre.genreLivre);
    }

    this.NewLivreForm.controls.titre.setValue(livre.titre);
    this.NewLivreForm.controls.typeOuvrage.setValue(livre.type);

    // this.editBody.id = livre.id;
    this.editBody.image = livre.image;
    this.imageOuvrage = livre.image;
    this.NewLivreForm.controls.journal.setValue(livre.journal);
    this.NewLivreForm.controls.dateDePublication.setValue(Util_fonction.DateConvert2(livre.dateDePublication));
    // this.NewLivreForm.controls.nbreExemplaireDisponible.setValue(livre.nbreExemplaireDisponible);
    this.NewLivreForm.controls.nbreExemplaireTotal.setValue(livre.nbreExemplaireTotal);
    this.NewLivreForm.controls.nbrePage.setValue(livre.nbrePage);
    this.NewLivreForm.controls.isbnIssn.setValue(livre.isbnIssn);
    this.NewLivreForm.controls.description.setValue(livre.description);
    this.NewLivreForm.controls.disponibilite.setValue(livre.disponibilite);
    this.NewLivreForm.controls.disponibilite.setValue(livre.disponibilite);
    this.NewLivreForm.controls.langue.setValue(livre.langue);
    const ans = livre.annee - 1;
    const anneeScloraire = ans+" - "+livre.annee;
    this.NewLivreForm.controls.anneeScolaire.setValue(anneeScloraire);

    if(livre.users.length > 0){
      for(let user of livre.users){
        if(user.hasOwnProperty("etudiant")){
          this.NewLivreForm.controls.student.setValue(user.etudiant.id);
        }else{
          this.NewLivreForm.controls.teacher.setValue(user.personnel.id);
        }
      }
    }



    $('#NewLivreFormModal').modal('show');
    $('#NewLivreFormModal').appendTo('body');
  }

  SubmitUpdateLivre(){
    // this.editBody.auteurs = this.NewLivreForm.controls._auteur.value;
    if (Util_fonction.checkIfNoTEmpty(this.NewLivreForm.controls._auteur.value)){
      this.editBody.auteurs = this.NewLivreForm.controls._auteur.value;
    }
    

    this.editBody.type = this.NewLivreForm.controls.typeOuvrage.value;
    this.editBody.titre = this.NewLivreForm.controls.titre.value;
    this.editBody.editeur = this.NewLivreForm.controls.editeur.value;
    this.editBody.genreLivre = this.NewLivreForm.controls.genre.value;
    this.editBody.dateDePublication = this.NewLivreForm.controls.dateDePublication.value;
    this.editBody.description = this.NewLivreForm.controls.description.value;
    this.editBody.disponibilite = this.NewLivreForm.controls.disponibilite.value;
    this.editBody.isbnIssn = this.NewLivreForm.controls.isbnIssn.value;
    this.editBody.langue = this.NewLivreForm.controls.langue.value;
    this.editBody.nbreExemplaireTotal = +this.NewLivreForm.controls.nbreExemplaireTotal.value;
    this.editBody.nbrePage = +this.NewLivreForm.controls.nbrePage.value;
    this.editBody.structure.id = +this.IdStructure;

    this.editBody.journal = this.NewLivreForm.controls.journal.value;

    if (Util_fonction.checkIfNoTEmpty(this.NewLivreForm.controls.teacher.value)){
      this.editBody.users.push({id: +this.NewLivreForm.controls.teacher.value});
    }
    if (Util_fonction.checkIfNoTEmpty(this.NewLivreForm.controls.student.value)){
      this.editBody.users.push({id: +this.NewLivreForm.controls.student.value});
    }

    
    if (this.ImageSelectEvent){
      this.uploadImageLivre();
    } else {
      this.UpdateLivre();
    }

  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected();
  }

  submitForm() {
    // for (let aut of this.AuteursList){
    //   if (this.allAuteurs.includes(aut.nom) && aut.id !== null && aut.id !== ""){
    //     this.addBody.auteurs.push({id: aut.id});
    //   }
    // }
    
    // this.addBody.auteurs.push(); // --??
    this.addBody.type = this.NewLivreForm.controls.typeOuvrage.value;
    this.addBody.titre = this.NewLivreForm.controls.titre.value;
    if (Util_fonction.checkIfNoTEmpty(this.NewLivreForm.controls._auteur.value)){
      this.addBody.auteurs = this.NewLivreForm.controls._auteur.value;
    }
    this.addBody.editeur = this.NewLivreForm.controls.editeur.value;
    this.addBody.genreLivre = this.NewLivreForm.controls.genre.value;
    this.addBody.dateDePublication = this.NewLivreForm.controls.dateDePublication.value;
    this.addBody.description = this.NewLivreForm.controls.description.value;
    this.addBody.disponibilite = this.NewLivreForm.controls.disponibilite.value;
    // this.addBody.image = this.NewLivreForm.controls.editeur.value;
    this.addBody.isbnIssn = this.NewLivreForm.controls.isbnIssn.value;
    this.addBody.langue = this.NewLivreForm.controls.langue.value;
    // this.addBody.nbreExemplaireDisponible = +this.NewLivreForm.controls.nbreExemplaireDisponible.value;
    this.addBody.nbreExemplaireTotal = +this.NewLivreForm.controls.nbreExemplaireTotal.value;
    this.addBody.nbrePage = +this.NewLivreForm.controls.nbrePage.value;
    this.addBody.structure.id = +this.IdStructure;
    this.addBody.journal = this.NewLivreForm.controls.journal.value;

    if (Util_fonction.checkIfNoTEmpty(this.NewLivreForm.controls.teacher.value)){
      this.addBody.users.push({id: +this.NewLivreForm.controls.teacher.value});
    }
    if (Util_fonction.checkIfNoTEmpty(this.NewLivreForm.controls.student.value)){
      this.addBody.users.push({id: +this.NewLivreForm.controls.student.value});
    }
    
    this.uploadImageLivre();
  }

  SaveLivre(){
    this.ouvragesService.add_Livre(this.addBody).subscribe(livreAddRes => {

      $('#NewLivreFormModal').modal('hide');
      // this.getOuvrage();
      this.Spinner = false;
      this.ImageSelectEvent = false;
      const msg = "retrouver l'ouvrage en utilisant les champs de filtres !"
      Util_fonction.SuccessMessage(livreAddRes+ " "+ msg);
    }, error => {
      this.Spinner = false;
      this.ImageSelectEvent = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  UpdateLivre(){
    this.ouvragesService.edit_Livre(this.editID, this.editBody).subscribe(livreEditRes => {

      $('#NewLivreFormModal').modal('hide');
      this.getOuvrage();
      this.Spinner = false;
      this.ImageSelectEvent = false;
      Util_fonction.SuccessMessage(livreEditRes);
    }, error => {
      this.Spinner = false;
      this.ImageSelectEvent = false;
      Util_fonction.AlertMessage(error.error.status,error.error.message);
    })
  }

  AddEmprunt(){
    const currentDate = JSON.parse(sessionStorage.getItem("dateEnCours"));
    const body =
      {
        annee: currentDate.anneeScolaire,
        dateEmprunt: Util_fonction.convertDate(new Date()),
        dateRetour: this.dateRetour,
        ouvrages: this.SendDataArray.map(item => {
          return {id: item.id};
        }),
        statut: 'EMPRUNTE',
        structure: {id: this.user.structure.id},
        user: {id: this.userEmprunt.id}
      }
    
    this.ouvragesService.add_emprunt(body).subscribe(empruntRes => {
      
    });

  }

  supprimerLivre(element){

    Swal.fire({
      title: 'Voulez vous supprimer ce livre',
      html: '<strong>'+element.titre+'</strong>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',

    }).then((result) => {
      if (result.isConfirmed) {
        this.ouvragesService.deleteLivre(element.id).subscribe(
          response => {
            Util_fonction.SuccessMessage(response);
            this.getOuvrage();
          },error =>{
            Util_fonction.AlertMessage(error.error.status,error.error.message);
          },
        );
      }
    })
  }


  onselectFile(e){
    if(e.target.files){
      var reader = new FileReader();

      this.UpoloadFile = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.imageOuvrage=event.target.result;
        this.ImageSelectEvent = true;
      }
    }
  }

  uploadImageLivre(){
    // if (this.action === "new"){
    //   this.SaveLivre();
    // } else {
    //   this.UpdateLivre();
    // }
    if (this.ImageSelectEvent){
      let fd = new FormData();
      fd.append('file', this.UpoloadFile);
      fd.append('fileType', "AUTRE");
      this.fileService.uploadLivreImage(fd).subscribe(async imageuploadres => {
        
        await this.delay(2500);
        if (this.action === "new"){
          this.addBody.image = imageuploadres.toString();
          this.SaveLivre();
        } else {
          this.editBody.image = imageuploadres.toString();
          this.UpdateLivre();
        }
      });
    } else {
      
    }
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  displayFn(utilisateur: any): string {
    let result: any;
    
    if (typeof utilisateur === 'object'){
      // if (utilisateur.hasOwnProperty('users')){
      //   result = utilisateur && utilisateur.users.id ?  utilisateur.users.prenom+' '+utilisateur.users.nom :'';
      // } else {
        result = utilisateur && utilisateur.user.id ? utilisateur.user.prenom+' '+utilisateur.user.nom  :'';
      }
    // } else {
    //   // result
    // }
    return result;
  }

  livreItemFilter(genre: any): string {
    return genre && genre.id ? genre.nom : '';
  }

  // ENSEIGNANT
  private Enseignant_filter(value: any): any{
    
    const filterValue = value.toLowerCase();
    
    if (this.enseignantControl.value.hasOwnProperty('user') && Util_fonction.checkIfNoTEmpty(this.enseignantControl.value.user.id)){
      this.NewLivreForm.controls.teacher.setValue(this.enseignantControl.value.user.id);
      
    }

    // if (this.etudiantControl.value.hasOwnProperty('users')){
    //   this.NewLivreForm.controls.student.setValue(this.etudiantControl.value.users.id);
    
    // }

    return this.Enseignants.filter(enseignant => enseignant.user.prenom.toLowerCase().includes(filterValue)); //this.Enseignants;// [{user:{nom: 'azerty', prenom: 'azerty1', id: 777}},{user: {nom: 'azerty2', prenom: 'azerty2', id: 888}}];
  }

  // ETUDIANT
  // private Etudiant_filter(value: any): any{
  //   const filterValue = value.toLowerCase();
  //
  
  //   if (this.etudiantControl.value.hasOwnProperty('user') && Util_fonction.checkIfNoTEmpty(this.etudiantControl.value.user.id)){
  //     this.NewLivreForm.controls.student.setValue(this.etudiantControl.value.user.id);
  
  //   }
  //   // if (this.etudiantControl.value.hasOwnProperty('users')){
  //   //   this.NewLivreForm.controls.student.setValue(this.etudiantControl.value.users.id);
  
  //   // }
  //
  //   return this.Etudiants.filter(etudiant => etudiant.user.prenom.toLowerCase().includes(filterValue)); //this.Enseignants;// [{user:{nom: 'azerty', prenom: 'azerty1', id: 777}},{user: {nom: 'azerty2', prenom: 'azerty2', id: 888}}];
  // }

  // GENRE
  private Genre_filter(value: any): any {
    const filterValue = value.toLowerCase();
    if (Util_fonction.checkIfNoTEmpty(this.genreControl.value)){
      this.NewLivreForm.controls.genre.setValue(this.genreControl.value.nom);
      
    } else {
      this.NewLivreForm.controls.genre.setValue(value);
    }
    return this.GenresList.filter(genre => genre.nom.toLowerCase().includes(filterValue)); //this.Enseignants;// [{user:{nom: 'azerty', prenom: 'azerty1', id: 777}},{user: {nom: 'azerty2', prenom: 'azerty2', id: 888}}];
  }

  // EDITEUR
  private Editeur_filter(value: any): any {
    const filterValue = value.toLowerCase();
    if (Util_fonction.checkIfNoTEmpty(this.editeurControl.value)){
      this.NewLivreForm.controls.editeur.setValue(this.editeurControl.value.nom);
      
    } else {
      this.NewLivreForm.controls.editeur.setValue(value);
    }
    return this.EditeursList.filter(editeur => editeur.nom.toLowerCase().includes(filterValue)); //this.Enseignants;// [{user:{nom: 'azerty', prenom: 'azerty1', id: 777}},{user: {nom: 'azerty2', prenom: 'azerty2', id: 888}}];
  }

  // data = {
  //   date: null,
  //   etudiant_id: null,
  //   option_id: null,
  //   statut: null,
  //   type: 'TRANSFERT'
  // }
  isCheckedOrNot(event, element?){
    // this.data.type = "";
    

    if (event.target.name === 'allSelector'){
      // this.CheckALl(event.target.checked);
    }else {
      this.CheckSing(event,element);
    }
  }

  SendDataArray = [];
  // CheckALl(status){
  //   // let element = document.getElementsByClassName('ck');
  //   let element = $('.ck');
  //   if (status){
  //     this.SendDataArray = [];
  //     for (let i = 0; i < element.length; i++) {
  //       this.SendDataArray.push({
  //         id: +element[i].value,
  //       });
  //       element[i].checked = status;
  //     }
  //   } else {
  //     for (let j = 0; j < element.length; j++) {
  //       element[j].checked = status;
  //       this.SendDataArray = this.SendDataArray.filter(d => +d.id !== +element[j].value);
  //     }
  //   }
  
  // }

  CheckSing(event, element){
    if (event.target.checked){
      // this.data.etudiant_id = event.target.value;
      this.SendDataArray.push({
        id: +event.target.value,
        data: element
      });

    }else {
      this.SendDataArray = this.SendDataArray.filter(data => {
        return +data.id !== +event.target.value && data;
      });
    }

    
  }

  showArray =[];
  confirmEmprunt(){
    // this.showArray = this.
    
    $('#EmpruntFormModal').modal('show');
    $('#EmpruntFormModal').appendTo('body');
  }
  dateRetour;
  initForm(){
    this.SearchForm = this.formbuilder.group({
      searchType : new FormControl(null),
      titre: new FormControl(null),
      id_auteur: new FormControl(null),
      id_editeur: new FormControl(null),
      id_genre: new FormControl(null),
    });
  }

  initNewLivreForm(){
    this.NewLivreForm = this.formbuilder.group({
      typeOuvrage:  new FormControl(null, [Validators.required]),
      titre: new FormControl(null, [Validators.required]),
      dateDePublication : new FormControl(null, [Validators.required]),
      description : new FormControl(null, [Validators.required]),
      disponibilite : new FormControl(null, [Validators.required]),
      langue : new FormControl(null, [Validators.required]),
      // nbreExemplaireDisponible : new FormControl(null, [Validators.required]),
      nbrePage : new FormControl(null, [Validators.required]),

      editeur : new FormControl(null),
      genre : new FormControl(null),
      nbreExemplaireTotal : new FormControl(null),
      isbnIssn : new FormControl(null),
      image : new FormControl(null),
      _auteur: new FormControl(null),
      journal: new FormControl(null),

      teacher: new FormControl(null),
      student: new FormControl(null),
      anneeScolaire: new FormControl(null),
    });

    this.articleIsChoose = false;
    this.memoireIsChoose = false;
    this.livreIsChoose  = false;
    this.imageOuvrage  = null;

    // this.enseignantControl = new FormControl();
    // this.etudiantControl = new FormControl();
    this.addBody.users = [];
    this.editBody.users = [];
  }


}
