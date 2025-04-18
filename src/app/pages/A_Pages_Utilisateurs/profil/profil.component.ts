import { Component, HostListener, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import {FilesService} from "../../../services/files.service";
import Swal from "sweetalert2";
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
import {Util_fonction} from "../../models/util_fonction";

@Component({
  selector: 'ngx-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  detect = 0;
  title = 'Mon Profil'
  newUsername = '';
  user: any;
  spinner = false;
  passwordForm: FormGroup;
  usernameForm: FormGroup;
  PhotoChangeForm: FormGroup;
    disabledSubmitButton: boolean = true;
    disabledSubmitButton2: boolean = true;
    changPhotoEvent: boolean = false;
    optionsSelect: Array<any>;
    error: any;
    error1: any;
    photoProfil: any;
    UpoloadFile: any;
    message = null;

    change() {

      if (this.passwordForm.valid) {
        this.disabledSubmitButton = false;
        }
      if (this.usernameForm.valid) {
        this.disabledSubmitButton2 = false;
        }
      }


  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private personnelAdminService: PersonnelAdminService,
              private fileService: FilesService) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.passwordForm = this.formBuilder.group({
      'newPassword': ['', Validators.required],
      'verifPassword': ['', Validators.required],
      // 'contactFormEmail': ['', Validators.compose([Validators.required, Validators.email])],
      'oldPassword': ['', Validators.required],
      'idUser': [this.user.users.id, Validators.required],
      });
    this.usernameForm = this.formBuilder.group({
      'newUsername': ['', Validators.required],
      'password': ['', Validators.required],
      'idUser': [this.user.users.id, Validators.required],
      });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('profileChange')){
      this.user.users.photo = sessionStorage.getItem('profileChange');
    } else {
      this.photoProfil = this.user.users.photo;
    }
    this.initPhoto();
  }

  spinnerPassUpdate: boolean = false;
  passwordUpdate() {
    // this.spinner = true;
    this.spinnerPassUpdate = true;
    this.message = null;
    if (this.passwordForm.invalid) {
      this.spinner = false;
      this.spinnerPassUpdate = false;
      return;
    }
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.verifPassword) {
      Util_fonction.AlertMessage("warning", "Les deux mots de passe ne sont pas identiques");
      // this.error.error = '';
      this.spinner = false;
      this.spinnerPassUpdate = false;
      return;
    }
    if (this.passwordForm.value.verifPassword.length < 6){
      this.spinner = false;
      Util_fonction.AlertMessage("warning", "veuillez entrer au minimum un mot de passe de 6 caractères !");
      return;
    }
    const data = {
      // idUser : this.passwordForm.value.idUser,
      newPassword : this.passwordForm.value.newPassword,
      confirmPassword : this.passwordForm.value.verifPassword,
      oldPassword : this.passwordForm.value.oldPassword
    };
    this.authService.passwordForm(data).subscribe(
      (res) => {
        this.spinnerPassUpdate = false;
        // this.message = res;
        Util_fonction.SuccessMessage(res);
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
        this.spinnerPassUpdate = false;
      },
    );
  }

  usernameUpdate() {
    this.spinner = true;
    this.message = null;
    if (this.usernameForm.invalid) {
      this.spinner = false;
      return;
    }
    this.authService.usernameUpdate(this.usernameForm.value).subscribe(
      (res) => {
        this.spinner = false;
        Util_fonction.SuccessMessage(res);
      },
      (error) => {
        Util_fonction.AlertMessage(error.error.status,error.error.message);
        this.spinner = false;
      },
    );
  }

  changer(detect){
    this.detect = detect;
    if(detect == 0){
      this.title = 'Mon Profil'
    } else if(detect == 1){
      this.title = 'Modifier mon nom d\'utilisateur'
    } else if(detect == 2){
      this.title = 'Modifier mon mot de passe'
    } else if(detect == 3){
      this.title = 'Modifier ma photo'
    }
  }

  onselectFile(e){
    if(e.target.files){
      var reader = new FileReader();

      this.UpoloadFile = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.changPhotoEvent = true;
        this.photoProfil=event.target.result;
      }
    }
  }

  ChangerPhoto(){
    this.changPhotoEvent = false;
    if (sessionStorage.getItem('profileChange')){
      this.photoProfil = sessionStorage.getItem('profileChange');
    } else {
      this.photoProfil = this.user.users.photo;
    }
  }

  ChangeMyProfile(){
    let fd = new FormData();
    fd.append('file', this.UpoloadFile);
    fd.append('id_user', this.user.users.id);
      this.fileService.UpdatePhotoUSER(fd, this.user.users.id).subscribe( Changeres => {
        Util_fonction.SuccessMessage(Changeres);

        this.personnelAdminService.getUserByID(this.user.users.id).subscribe(userGetRes => {
          this.user.users.photo = userGetRes.photo;
          sessionStorage.setItem('profileChange',userGetRes.photo);
        });

      }, ChangeError => {
        Util_fonction.AlertMessage(ChangeError.error.status,ChangeError.error.message);
      })
  }

  initPhoto(){
    this.PhotoChangeForm = this.formBuilder.group({
      profilPhoto: new FormControl(null, [Validators.required])
    });
  }
}
