import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'ngx-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.scss']
})
export class Header2Component implements OnInit {
    src = "../../../"+environment._ASSET_IMAGE;
    active = 'home';
    loginForm: FormGroup;
    tokenForm: FormGroup;
    emailForm: FormGroup;
    disabledSubmitButton: boolean = true;
    disabledSubmitButton2: boolean = true;
    disabledSubmitButton3: boolean = true;
    optionsSelect: Array<any>;
    error: any;
    spinner = false;
    user: any;
    state = 0;
    message = null;
    messageRes = null;

    @HostListener('input') oninput() {

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

  constructor(private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    ) {
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
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('user')){
      this.user = JSON.parse(sessionStorage.getItem('user'))
      this.src = this.user.structure.logo;
    };

  }

  statistique() {
    this.active = 'statistique';
        this.router.navigate(['/pages/utilisateur/statistique']);
  }

  gestionInscription(param) {
    this.active = 'gestion';
        this.router.navigate(['/pages/utilisateur/gestionInscription'], { queryParams:{ param: param }});
  }

  deconnection(){
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.user = null;
    this.src = "../../../"+environment._ASSET_IMAGE;
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
        this.user = res;
        this.spinner = false;
        sessionStorage.setItem('token', res['token']);
        sessionStorage.setItem('user', JSON.stringify(res));
        this.ngOnInit()
      },
      (error) => {
        this.error = error;
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
    if (this.tokenForm.value.newPassword != this.tokenForm.value.confirmPassword) {
      this.error.error = "Les deux mots de passe ne sont pas identiques";
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
        this.error = error;
        this.spinner = false;
      },
    );

  }
    navigateHome() {
      this.active = 'home';
        this.router.navigate(['/pages/utilisateur/home']);
        // window.location.reload();
    }
    navigatePreInscription () {
        this.active = 'preinscription';
        this.router.navigate(['/pages/utilisateur/pre-inscription']);
    }

    navigatePayement(){
        this.active = 'payement';
        this.router.navigate(['/pages/utilisateur/payement']);
    }

    navigateAuthPage(){
        this.router.navigate(['/auth/login']);
    }

    // REDIRECTIONS WHEN USER IS CONNECT
    GoToStructureGestion(){
        this.router.navigate(['/pages/structure']);
    }

    GoToCandidatsGestion(){
        this.router.navigate(['/pages/candidat']);
    }
    GoToFraisGestion(){
        this.router.navigate(['/pages/frais']);
    }

    gestionReclamation(){
        this.active = 'reclamations';
        this.router.navigate(['/pages/reclamations-etudiants']);
    }



}
