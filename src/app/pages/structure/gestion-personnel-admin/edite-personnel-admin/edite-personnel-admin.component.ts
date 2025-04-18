import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PAYS_MONDE} from "../../../PAYS_MODE";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonnelAdminService} from "../../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {SpecialiteFonctionService} from "../../../../services/specialite-fonction.service";
// import {UtilsService} from "../../../../services/utils.service";

@Component({
  selector: 'ngx-edite-personnel-admin',
  templateUrl: './edite-personnel-admin.component.html',
  styleUrls: ['./edite-personnel-admin.component.scss']
})
export class EditePersonnelAdminComponent implements OnInit {

    PersonnelAdminForm: FormGroup;
    Pays = PAYS_MONDE;
    EditPersonnelData = {
        departement: {
            id :'',
        },
        dateEmbauche :'',
        fonction: {
            id :'',
        },
        id :'',
        user :{
            typeUtilisateur :'',
            ville :'',
            rue :'',
            numMatricule :'',
            photo :'',
            telephone :'',
            lieuDeNaissance :'',
            nom :'',
            dateDeNaissance :'',
            quartier :'',
            genre :'',
            porte :'',
            id :'',
            prenom :'',
            email :'',
            pays :'',}
    };
    editID;
    depID;
    Fonctions;

  constructor(private routerActive: ActivatedRoute,
              private formBuilder: FormBuilder,
              private fonctionSpecialService: SpecialiteFonctionService,
            //   private utilService: UtilsService,
              private router: Router,
              private personnelService: PersonnelAdminService) { }

  ngOnInit(): void {
    const iD = this.routerActive.snapshot.paramMap.get("id"); // ID personnel
      this.GetEditFormData(iD);
      this.getAllFoctions();
  }

    getAllFoctions() {
        this.fonctionSpecialService.getAllFoctionSpecialite().subscribe(fonctRes =>{
            console.log(fonctRes);
            this.Fonctions = fonctRes;
        });
    }

    /***
     * Mise à jour d'un personnel Administratif

    // update_PersonnelAdmin(){
    //     this.personnelService.updatePersonnel( this.EditPersonnelData).subscribe(res =>{
    //         // this.utilService.showToast('success', 'Succès', res.toString());
    //         this.router.navigate(['/pages/departement/:'+this.depID+'/personnelAdministratifs'])
    //     },error1 => {
    //         // this.utilService.showToast('danger', 'Erreur', error1['error']);
    //     });
    // }

    /***
     * Methode qui remplie le formulaire de dans le HTML
     * @param id
     * @constructor
     */
    GetEditFormData(id){
      this.personnelService.getStructurePersonnel(id).subscribe(personnelRes => {
          this.editID =id;
          this.depID = personnelRes['departement']['id'];
          this.PersonnelAdminForm.controls.departement.setValue(personnelRes['departement']['id']);
          this.PersonnelAdminForm.controls.dateEmbauche.setValue(personnelRes['dateEmbauche']);

          this.PersonnelAdminForm.controls.fonction.setValue(personnelRes['fonction']['id']);

          this.PersonnelAdminForm.controls.id = id;  /** **** ID *************/

          this.PersonnelAdminForm.controls.typeUtilisateur.setValue(personnelRes['user']['typeUtilisateur']);
          this.PersonnelAdminForm.controls.ville.setValue(personnelRes['user']['ville']);
          this.PersonnelAdminForm.controls.rue.setValue(personnelRes['user']['rue']);
          this.PersonnelAdminForm.controls.numMatricule.setValue(personnelRes['user']['numMatricule']);

          this.PersonnelAdminForm.controls.photo.setValue(personnelRes['user']['photo']);
          this.PersonnelAdminForm.controls.telephone.setValue(personnelRes['user']['telephone']);
          this.PersonnelAdminForm.controls.lieuDeNaissance.setValue(personnelRes['user']['lieuDeNaissance']);
          this.PersonnelAdminForm.controls.nom.setValue(personnelRes['user']['nom']);
          this.PersonnelAdminForm.controls.dateDeNaissance.setValue(personnelRes['user']['dateDeNaissance']);
          this.PersonnelAdminForm.controls.quartier.setValue(personnelRes['user']['quartier']);
          this.PersonnelAdminForm.controls.genre.setValue(personnelRes['user']['genre']);
          this.PersonnelAdminForm.controls.porte.setValue(personnelRes['user']['porte']);

          this.PersonnelAdminForm.controls.idUser.setValue(personnelRes['user']['id']);

          this.PersonnelAdminForm.controls.prenom.setValue(personnelRes['user']['prenom']);
          this.PersonnelAdminForm.controls.email.setValue(personnelRes['user']['email']);
          this.PersonnelAdminForm.controls.pays.setValue(personnelRes['user']['pays']);
      });
    }

    /*** ***********
     * Méthode qui remplie dans la bonne forme les données à envoyer à L'API
     * @param id
     */
    fullEditFormDataToSend() {

        this.EditPersonnelData.departement.id= this.depID; // this.PersonnelAdminForm.controls.departement.value;
        this.EditPersonnelData.dateEmbauche= this.PersonnelAdminForm.controls.dateEmbauche.value;

        this.EditPersonnelData.fonction.id= this.PersonnelAdminForm.controls.fonction.value;
        this.EditPersonnelData.id= this.editID;  /** **** ID *************/

        this.EditPersonnelData.user.id= this.PersonnelAdminForm.controls.user.value;
        this.EditPersonnelData.user.typeUtilisateur= this.PersonnelAdminForm.controls.typeUtilisateur.value;
        this.EditPersonnelData.user.ville= this.PersonnelAdminForm.controls.ville.value;
        this.EditPersonnelData.user.rue= this.PersonnelAdminForm.controls.rue.value;
        this.EditPersonnelData.user.numMatricule= this.PersonnelAdminForm.controls.numMatricule.value;
        this.EditPersonnelData.user.photo= this.PersonnelAdminForm.controls.photo.value;
        this.EditPersonnelData.user.telephone= this.PersonnelAdminForm.controls.telephone.value;
        this.EditPersonnelData.user.lieuDeNaissance= this.PersonnelAdminForm.controls.lieuDeNaissance.value;
        this.EditPersonnelData.user.nom= this.PersonnelAdminForm.controls.nom.value;
        this.EditPersonnelData.user.dateDeNaissance= this.PersonnelAdminForm.controls.dateDeNaissance.value;
        this.EditPersonnelData.user.quartier= this.PersonnelAdminForm.controls.quartier.value;
        this.EditPersonnelData.user.genre= this.PersonnelAdminForm.controls.genre.value;
        this.EditPersonnelData.user.porte= this.PersonnelAdminForm.controls.porte.value;
        this.EditPersonnelData.user.id= this.PersonnelAdminForm.controls.idUser.value;  //this.idUser; /** *** ID USER*************/
        this.EditPersonnelData.user.prenom= this.PersonnelAdminForm.controls.prenom.value;
        this.EditPersonnelData.user.email= this.PersonnelAdminForm.controls.email.value;
        this.EditPersonnelData.user.pays= this.PersonnelAdminForm.controls.pays.value;

    }

    initForm(){
        /*** INISIATISATION DU FORMULAIRE DE  MISE A JOURS */
        this.PersonnelAdminForm = this.formBuilder.group({

            id : new FormControl(null),

            //departement
            departement: new FormControl(null), // idDepartement

            dateEmbauche: new FormControl(null, [Validators.required]),

            // fonction
            fonction: new FormControl(null, [Validators.required]), // id

            // User
            typeUtilisateur: new FormControl(null, [Validators.required]),
            ville: new FormControl(null, [Validators.required]),
            rue: new FormControl(null),
            numMatricule: new FormControl(null, [Validators.required]),
            photo: new FormControl(null),
            telephone: new FormControl(null, [Validators.required]),
            lieuDeNaissance: new FormControl(null, [Validators.required]),
            nom: new FormControl(null, [Validators.required]),
            dateDeNaissance: new FormControl(null, [Validators.required]),
            quartier: new FormControl(null, [Validators.required]),
            genre: new FormControl(null, [Validators.required]),
            porte: new FormControl(null),
            idUser: new FormControl(null),
            prenom: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.required]),
            pays: new FormControl(null, [Validators.required]),
        });
    }

}
