
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

import {AjouterStructureComponent} from './structure/ajouter-structure/ajouter-structure.component';
import {ModifierStructureComponent} from './structure/modifier-structure/modifier-structure.component';

import {CandidatureComponent} from './candidature/candidature.component';
import {AccueilComponent} from './accueil/accueil.component';
import {NotFoundComponent} from './not-found/not-found.component';

import {EtudiantComponent} from './GestionEtudiants/etudiant/etudiant.component';
import {FraisInscriptionComponent} from './GestionFrais/frais-inscription/frais-inscription.component';
import {AddFraisInscriptionComponent} from './GestionFrais/frais-inscription/add-frais-inscription/add-frais-inscription.component';
import {ModifFraisInscriptionComponent} from './GestionFrais/frais-inscription/modif-frais-inscription/modif-frais-inscription.component';
import {SpecialiteFonctionComponent} from './specialite-fonction/specialite-fonction.component';
import {HomeComponent} from './A_Pages_Utilisateurs/home/home.component';
// import {PreInscriptionsComponent} from './A_Pages_Utilisateurs/pre-inscriptions/pre-inscriptions.component';
// import {StatutCandidatCheckComponent} from './A_Pages_Utilisateurs/statut-candidat-check/statut-candidat-check.component';
// import {PreIncriptionFormComponent} from './A_Pages_Utilisateurs/pre-inscriptions/pre-incription-form/pre-incription-form.component';


import {FiliereComponent} from './GestionFilieres/filiere/filiere.component';
import {PayementComponent} from './A_Pages_Utilisateurs/payement/payement.component';
import { ProfilComponent } from './A_Pages_Utilisateurs/profil/profil.component';

import { ResetPasswordCodeComponent } from './A_Pages_Utilisateurs/reset-password-code/reset-password-code.component';

import {OffresComponent} from "./A_Pages_Utilisateurs/offres/offres.component";
import {ListOffresEntrepriseComponent} from "./A_Pages_Utilisateurs/list-offres-entreprise/list-offres-entreprise.component";
import {ReclamationsComponent} from "./GestionEtudiants/reclamations/reclamations.component";
import {CreationCVComponent} from "./Paul/creation-cv/creation-cv.component";
import {ParcoursComponent} from "./GestionEtudiants/parcours/parcours.component";
import {StatutCandidatCheckComponent} from "./A_Pages_Utilisateurs/statut-candidat-check/statut-candidat-check.component";
import {FormPreinscriptionComponent} from "./A_Pages_Utilisateurs/form-preinscription/form-preinscription.component";
import {ModifPreInscriptionComponent} from "./A_Pages_Utilisateurs/modif-pre-inscription/modif-pre-inscription.component";
import {RegisterCandidatFormComponent} from "./A_Pages_Utilisateurs/register-candidat-form/register-candidat-form.component";
import {FormCandidatureComponent} from "./A_Pages_Utilisateurs/form-candidature/form-candidature.component";
import {ReInscriptionAncienComponent} from "./Paul/re-inscription-ancien/re-inscription-ancien.component";
import {ReInscriptionComponent} from "./Paul/re-inscription/re-inscription.component";
import {ListPassageComponent} from "./Paul/list-passage/list-passage.component";
import {DemandeEtudiantsComponent} from "./Paul/demande-etudiants/demande-etudiants.component";
import {ListPassageAllComponent} from "./Paul/list-passage-all/list-passage-all.component";
import {ListAdmissionComponent} from "./Paul/list-admission/list-admission.component";
import {EtudianNoteConsultationComponent} from "./Paul/etudian-note-consultation/etudian-note-consultation.component";

const routes: Routes = [{
  path: 'pages',
  component: PagesComponent,
  // component: AccueilComponent,
  children: [
    {
      path: 'utilisateur/home',
      component: HomeComponent,
    },
    {
      path: 'utilisateur/resetPasswordCode',
      component: ResetPasswordCodeComponent,
    },
    {
      path: 'utilisateur/profil',
      component: ProfilComponent,
    },
  {
    path: 'utilisateur/registerCandidatForm',
    component: RegisterCandidatFormComponent,
  },
  {
    path: 'utilisateur/statutCandidat_verification',
    component: StatutCandidatCheckComponent,
  },
  {
    path: 'utilisateur/preIncriptionForm',
    component: FormPreinscriptionComponent,
  },
  {
    path: 'utilisateur/re-inscription',
    component: ReInscriptionComponent
  },
  {
    path: 'utilisateur/pre-inscription_Modification',
    component: ModifPreInscriptionComponent,
  },
    {
      path: 'utilisateur/CandidatureForm',
      component: FormCandidatureComponent,
    },
  {
    path: 'utilisateur/payement',
    component: PayementComponent,
  },
    {
    path: 'utilisateur/List_offre_entreprise',
    component: ListOffresEntrepriseComponent,
  },
    {
    path: 'utilisateur/offre/structure',
    component: OffresComponent,
  },
    {
      path: 'accueil',
      component: AccueilComponent,
    },
    // {
    //   path: 'structure',
    //   component: ListStructureComponent,
    // },
    {
      path: 'structure/ajouter',
      component: AjouterStructureComponent,
    },
    
    {
      path: 'modifier_structure/:id',
      component: ModifierStructureComponent,
    },
    {
      path: 'structure/:id/candidature',
      component: CandidatureComponent,
    },
    {
      path: 'etudiant/reclamations',
      component: ReclamationsComponent,
    },

    {
      path: 'filieres_options',
      component: FiliereComponent,
    },
    {
      path: 'etudiant',
      component: EtudiantComponent,
    },{
      path: 'etudiant/creation_cv',
      component: CreationCVComponent,
    },{
      path: 'etudiant/Parcours',
      component: ParcoursComponent,
    },{
      path: 'etudiant/notes',
      component: EtudianNoteConsultationComponent,
    },{
      path: 'etudiant/demandes',
      component: DemandeEtudiantsComponent,
    },

    {
      path: 'frais_inscription',
      component: FraisInscriptionComponent,
    },
    {
      path: 'utilisateur/re_inscriptionAncien',
      component: ReInscriptionAncienComponent,
    },
    {
      path: 'ajouter_frais_inscription',
      component: AddFraisInscriptionComponent,
    },
    {
      path: 'modifier_frais_inscription/:id_frais_inscription',
      component: ModifFraisInscriptionComponent,
    },
    {
      path: 'specialite_fonction',
      component: SpecialiteFonctionComponent,
    },
    {
      path: 'utilisateur/Liste_Passage',
      component: ListPassageAllComponent,
    },{
      path: 'utilisateur/Liste_Admission',
      component: ListAdmissionComponent,
    },
    {
      path: '',
      redirectTo: 'accueil',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
