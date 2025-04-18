import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
import { StructureService } from '../../../services/structure.service';
declare var $: any;
import Swal from "sweetalert2";
import {structureSelected} from "../../REST_URL";
import {Util_fonction} from "../../models/util_fonction";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  src = environment._ASSET_IMAGE;
  active = 'home';
  loginForm: FormGroup;
  tokenForm: FormGroup;
  emailForm: FormGroup;
  disabledSubmitButton = true;
  disabledSubmitButton2 = true;
  disabledSubmitButton3 = true;
  optionsSelect: Array<any>;
  AllSeance: any = [];
  error: any;
  spinner = false;
  structurLoading = false;
  offreSelected = false;
  hasRole = false;
  user: any;
  structureSelected_Datas: any;
  state = 0;
  message = null;
  messageRes = null;
  allStructure = [];
  env = environment.env;
  structureSelected:boolean = structureSelected.etat;
  private intervallTime: NodeJS.Timer;

constructor(private router: Router,
  private authService: AuthService,
  private personnelAdminService: PersonnelAdminService,
  private formBuilder: FormBuilder,
  private structureService: StructureService
  ) {
  this.structureSelected = structureSelected.etat;
  this.tokenForm = this.formBuilder.group({
    'token': ['', Validators.required],
    'newPassword': ['', Validators.required],
    'confirmPassword': ['', Validators.required],
    });

  this.loginForm = this.formBuilder.group({
    'username': ['', Validators.required],
    // 'contactFormEmail': ['', Validators.compose([Validators.required, Validators.email])],
    'password': ['', Validators.required],
    });
  this.emailForm = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.allStructure = [];
}

change() {
      if (this.loginForm.valid) {
        this.disabledSubmitButton = false;
        }
      if (this.emailForm.valid) {
        this.disabledSubmitButton2 = false;
        }
      if (this.tokenForm.valid) {
        this.disabledSubmitButton3 = false;
        }
      }

      color(active) {
        this.active = active;
      }

      ShowEMploi() {
          $('#staticBackdrop12').modal('show');
          $('#staticBackdrop12').appendTo('body');
      }

ngOnInit(): void {
  if (structureSelected.etat === false){
    this.intervallTime = setInterval(()=>{
      this.structureSelected = structureSelected.etat;
      // if(sessionStorage.getItem('structureSelected')){
      //   sessionStorage.removeItem('structureSelected');
      // }
      if (structureSelected.etat === true){
        sessionStorage.setItem('structureSelected',JSON.stringify(structureSelected));
        // console.log('STOP');
        clearInterval(this.intervallTime);
      }
    },2000);
  }
  // this.structureSelected_Datas = JSON.parse(structureSelected.Data);
  // structureSelected.etat;

  if (sessionStorage.getItem('user')) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    clearInterval(this.intervallTime);
    if (this.user.users.etudiant) {
      const link = '/etudiant/';
      const id = this.user.users.etudiant.id;
      this.personnelAdminService.getAllSeance(link, id).subscribe((res) => {
        this.AllSeance = res;
      });
    }
    this.src = this.user.structure.logo;
  } else {
    /** Pour la selection de la structure auprès de la quelle on peut modifier sa cadidature ou sa pré-inscription */
    this.getStructures();
  }
}

getStructures() {
  this.structurLoading = true;
  this.structureService.getStuctures().subscribe(
    (res) => {

      for (const str of res) {
        // let st = ;
        if (str['type'] + '' !== 'Structure administratif') {
          this.allStructure.push(str);
        }
      }
      this.structurLoading = false;
    },
    (error) => {
      this.structurLoading = false;
      // this.error = error;
      // this.spinner = false;
    });
}


statistique() {
  this.active = 'statistique';
      this.router.navigate(['/pages/utilisateur/statistique']);
}
Structures() {
  this.active = 'Structures';
      this.router.navigate(['/pages/structure']);
}

  gestionReclamationEtudiants() {
    this.active = 'reclamation';
    this.router.navigate(['/pages/etudiant/reclamations']);
  }


gestionInscription(param) {
  this.active = 'gestion';
      this.router.navigate(['/pages/utilisateur/gestionInscription'], { queryParams: { param: param }});
}

  navigateOffreEntreprise(){
    this.active = 'offreEntre';
    this.router.navigate(['/pages/utilisateur/List_offre_entreprise']);
  }

  // navigateOffreStage(){
  //   this.active = 'offre';
  //   this.router.navigate(['/pages/utilisateur/offre/structure']);
  // }

deconnection() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('dateEnCours');
  this.user = null;
  this.src = '../../../'+environment._ASSET_IMAGE;
  this.navigateHome();
}
login() {
  this.spinner = true;
  this.error = {};
  if (this.loginForm.invalid) {
    return;
  }
  const formValue = this.loginForm.value;
  const username = formValue['username'];
  const password = formValue['password'];
  this.authService.authenticate(username, password).subscribe(
    (res) => {
      console.log(res);
      this.user = res;
      this.spinner = false;
      sessionStorage.setItem('token', res['token']);
      sessionStorage.setItem('user', JSON.stringify(res));
      this.personnelAdminService.getAnneeEnCours(this.user.structure.id).subscribe(
        (response) => {
          sessionStorage.setItem('dateEnCours', JSON.stringify(response));
        });
      this.ngOnInit();
      this.user['users']['roles'].forEach((item, index) => {
        if (item['nom'] === 'ROLE_ETUDIANT') {
            this.hasRole = true;
        }
        if (this.user['users']['roles'].length === (index + 1)) {
          if (this.hasRole) {
            //
            structureSelected.etat = true
            clearInterval(this.intervallTime);
            Swal.fire({
              icon: 'success',
              title: '',
              html: '<h4 class="text-center font-weight-bold">'+this.user['users']['etudiant']['prenom']+' '+
                this.user['users']['etudiant']['nom']+'</h4> <br> Vous êtes authentifié avec succès!',
              allowOutsideClick: false,
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'accéder à mon espace!'
            }).then((result) => {
              if (result.isConfirmed) {

                setTimeout(()=>{window.location.reload();},100);
              }
            })
          } else {
            this.router.navigate(['/admin']);
          }
        }
    });
    },
    (error) => {
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      console.log(error);
      // this.error = error;
      this.spinner = false;
    },
  );

}

sendToken() {
  this.spinner = true;
  this.error = {};
  this.messageRes = null;
  if (this.tokenForm.invalid) {
    return;
  }
  if (this.tokenForm.value.newPassword !== this.tokenForm.value.confirmPassword) {
    this.error.error = 'Les deux mots de passe ne sont pas identiques';
    this.spinner = false;
    return;
  }
  const formValue = this.tokenForm.value;
  this.authService.sendToken(formValue).subscribe(
    (res) => {
      this.messageRes = res;
      this.spinner = false;
      this.state = 0;
    },
    (error) => {
      this.error = error;
      this.spinner = false;
    },
  );

}

reset() {
  this.spinner = true;
  this.message = null;
  this.error = {};
  if (this.emailForm.invalid) {
    return;
  }
  const formValue = this.emailForm.value;
  const email = formValue['email'];

  this.authService.resetPassword(email).subscribe(
    (res) => {
      this.state = 2;
      this.message = res;
      this.spinner = false;
    },
    (error) => {
      // this.error = error;
      Util_fonction.AlertMessage(error.error.status, error.error.message);
      this.spinner = false;
    },
  );

}
  navigateHome() {
    this.active = 'home';
    this.structureSelected = false;
    this.offreSelected = false;
    structureSelected.etat = false;
    sessionStorage.removeItem('structureSelected');
    console.log('accueil click--');
    // this.router.navigate(['/pages/utilisateur/home']);
      setTimeout(()=>{window.location.reload();},100)
  }
  // NavigateToPreInscriptionModifier() {
  //   this.active = 'PreinscriptionModif';
  //     this.router.navigate(['/pages/utilisateur/pre-inscription']);
  // }
  //

  navigateAuthPage() {
      this.router.navigate(['/auth/login']);
  }

  // REDIRECTIONS WHEN USER IS CONNECT
  GoToStructureGestion() {
      this.router.navigate(['/pages/structure']);
  }

  GoToCandidatsGestion() {
          this.router.navigate(['/pages/candidat']);
      }

  GoToEvaluationGestion() {
          this.router.navigate(['/pages/evaluation']);
      }

      hasRoleEtudiant() {
        this.hasRole = false;
        if ( this.user && this.user['users'] ) {
        this.user['users']['roles'].forEach(item => {
            if (item['nom'] === 'ROLE_ETUDIANT') {
                this.hasRole = true;
            }
        });
        return this.hasRole;
      }
    }

}
