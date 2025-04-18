import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


// importation des modules

import { PagesComponent } from './pages.component';
import { AjouterStructureComponent } from './structure/ajouter-structure/ajouter-structure.component';
import { ModifierStructureComponent } from './structure/modifier-structure/modifier-structure.component';
import { CandidatureComponent } from './candidature/candidature.component';
import { AccueilComponent } from './accueil/accueil.component';

// importation des services

import {MatFormFieldModule} from '@angular/material/form-field';
import { NotFoundComponent } from './not-found/not-found.component';
import {PagesRoutingModule} from './pages-routing.module';
import { EtudiantComponent } from './GestionEtudiants/etudiant/etudiant.component';
import { PaiementComponent } from './GestionFrais/paiement/paiement.component';
import { FraisInscriptionComponent } from './GestionFrais/frais-inscription/frais-inscription.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import { AddFraisInscriptionComponent } from './GestionFrais/frais-inscription/add-frais-inscription/add-frais-inscription.component';
import { ModifFraisInscriptionComponent } from './GestionFrais/frais-inscription/modif-frais-inscription/modif-frais-inscription.component';
import {MatInputModule} from '@angular/material/input';
import { FiliereComponent } from './GestionFilieres/filiere/filiere.component';
import { SpecialiteFonctionComponent } from './specialite-fonction/specialite-fonction.component';

import {EvenementService} from '../services/evenement.service';
import { StatutCandidatCheckComponent } from './A_Pages_Utilisateurs/statut-candidat-check/statut-candidat-check.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import { PayementComponent } from './A_Pages_Utilisateurs/payement/payement.component';
import { EditePersonnelAdminComponent } from './structure/gestion-personnel-admin/edite-personnel-admin/edite-personnel-admin.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ResetPasswordCodeComponent } from './A_Pages_Utilisateurs/reset-password-code/reset-password-code.component';
// RECOMMENDED
import { AuthGuardService } from '../services/auth-guard.service';
import { AuthService } from '../services/auth.service';
import { BasicAuthInterceptorService } from '../services/basic-auth-interceptor.service';
import { DepartementService } from '../services/departement.service';
import { StructureService } from '../services/structure.service';

import { AjouterSpecialiteFonctionComponent } from './specialite-fonction/ajouter-specialite-fonction/ajouter-specialite-fonction.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './pierre/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

import {ImageCropperModule} from 'ngx-image-cropper';
import { CropComponent } from './A_Pages_Utilisateurs/crop/crop.component';



import { UnionModule } from '../material-component/union.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {} from '@angular/material/select';
import { OffresComponent } from './A_Pages_Utilisateurs/offres/offres.component';
import { ListOffresEntrepriseComponent } from './A_Pages_Utilisateurs/list-offres-entreprise/list-offres-entreprise.component';
import { ListeInteresseComponent } from './A_Pages_Utilisateurs/offres/liste-interesse/liste-interesse.component';
import {ReclamationsComponent} from "./GestionEtudiants/reclamations/reclamations.component";
import { EtudiantMenuComponent } from './Paul/etudiant-menu/etudiant-menu.component';
import { CreationCVComponent } from './Paul/creation-cv/creation-cv.component';
import { ParcoursComponent } from './GestionEtudiants/parcours/parcours.component';
import { FormPreinscriptionComponent } from './A_Pages_Utilisateurs/form-preinscription/form-preinscription.component';
import {ModifPreInscriptionComponent} from "./A_Pages_Utilisateurs/modif-pre-inscription/modif-pre-inscription.component";
import {NgxImageCompressService} from "ngx-image-compress";
import {RegisterCandidatFormComponent} from "./A_Pages_Utilisateurs/register-candidat-form/register-candidat-form.component";
import { FormCandidatureComponent } from './A_Pages_Utilisateurs/form-candidature/form-candidature.component';
import { ReInscriptionAncienComponent } from './Paul/re-inscription-ancien/re-inscription-ancien.component';
import {ReInscriptionComponent} from "./Paul/re-inscription/re-inscription.component";

import {DialogImputationCourrierComponent} from "./aicha/Courrier/courriers/dialog-imputation-courrier/dialog-imputation-courrier.component";
import {MatCheckboxModule} from "@angular/material/checkbox";

import { DemandeEtudiantsComponent } from './Paul/demande-etudiants/demande-etudiants.component';
import {MatRadioModule} from "@angular/material/radio";
import { EtudiantPasswordResetComponent } from './Paul/etudiant-password-reset/etudiant-password-reset.component';
import { CarteEnseignantsComponent } from './Paul/carte-enseignants/carte-enseignants.component';
import { ListPassageAllComponent } from './Paul/list-passage-all/list-passage-all.component';
import { NotationComponent } from './notation/notation.component';
import { EmargementsComponent } from './emargements/emargements.component';
import { ListAdmissionComponent } from './Paul/list-admission/list-admission.component';
import {MatTabsModule} from "@angular/material/tabs";
import {EtudiantUpdatePasswordComponent} from "./aicha/etudiant-update-password/etudiant-update-password.component";

import { EtudianNoteConsultationComponent } from './Paul/etudian-note-consultation/etudian-note-consultation.component';
import {AutocompleteLibModule} from "angular-ng-autocomplete";


@NgModule({
    imports: [ // ici les modules

        PagesRoutingModule,
        MatSelectModule,
        CommonModule,
        MatCardModule,
        MatDatepickerModule,
        MatToolbarModule,
        MatSidenavModule,
        ScrollingModule,
        MatDividerModule,
        MatExpansionModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDialogModule,
        MatStepperModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatPaginatorModule,
        UnionModule,
        MatMenuModule,
        MatInputModule,
        ImageCropperModule,
        MatCheckboxModule,
        MatRadioModule,
        AutocompleteLibModule,
    ],
  declarations: [ // ici les composants
    PagesComponent,
    // ListStructureComponent,
    // SingleStructureComponent,
    AjouterStructureComponent,
    ModifierStructureComponent,
    // AjouterDepartementComponent,
    // ModifierDepartementComponent,
    CandidatureComponent,
    AccueilComponent,
    NotFoundComponent,
    // CandidatComponent,
    EtudiantComponent,
    PaiementComponent,
    FraisInscriptionComponent,
    AddFraisInscriptionComponent,
    ModifFraisInscriptionComponent,
    FiliereComponent,
    SpecialiteFonctionComponent,
    AjouterSpecialiteFonctionComponent,
    StatutCandidatCheckComponent,
    // CandidatInfosComponent,
    // EvenementsComponent,
    // AnneeComponent,
    // CadidatSpecialiteComponent,
    // BacSpecialiteFiliereDialog,
    // GestionPersonnelAdminComponent,
    PayementComponent,
    EditePersonnelAdminComponent,
    ResetPasswordCodeComponent,
    HeaderComponent,
    CropComponent,
    ReclamationsComponent,
    OffresComponent,
    ListOffresEntrepriseComponent,
    ListeInteresseComponent,
    EtudiantMenuComponent,
    CreationCVComponent,
    ParcoursComponent,
    FormPreinscriptionComponent,
    ModifPreInscriptionComponent,
    RegisterCandidatFormComponent,
    FormCandidatureComponent,
    ReInscriptionComponent,
    ReInscriptionAncienComponent,
    DialogImputationCourrierComponent,

    DemandeEtudiantsComponent,



    ListPassageAllComponent,

    ListAdmissionComponent,
    EtudianNoteConsultationComponent,
    EtudiantUpdatePasswordComponent,
    // DemandeEtudiantTraitementComponent,
    // ListPassageComponent,
  ], entryComponents: [
    CropComponent,
    DialogImputationCourrierComponent,
    EtudiantUpdatePasswordComponent
    ],
  providers: [
    AuthService,
    AuthGuardService,
    StructureService,
    DepartementService,
    EvenementService,
    NgxImageCompressService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptorService,
      multi: true
    },
    // {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
})
export class PagesModule {
}
