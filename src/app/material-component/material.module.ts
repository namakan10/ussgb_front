import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { ButtonsComponent } from './buttons/buttons.component';

import { GridComponent } from './grid/grid.component';
import { ListsComponent } from './lists/lists.component';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';
import { StepperComponent } from './stepper/stepper.component';
import { ExpansionComponent } from './expansion/expansion.component';
import { ChipsComponent } from './chips/chips.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { ProgressComponent } from './progress/progress.component';
import {
  DialogComponent,
  DialogOverviewExampleDialogComponent
} from './dialog/dialog.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { UnionModule } from './union.module';
import { EvaluationComponent } from '../pages/A_Pages_Utilisateurs/evaluation/evaluation.component';
import { GestionInscriptionComponent } from '../pages/A_Pages_Utilisateurs/gestion-inscription/gestion-inscription.component';
import { StatistiqueComponent } from '../pages/A_Pages_Utilisateurs/statistique/statistique.component';
import {MatTabsModule} from '@angular/material/tabs';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import {FraisComponent} from '../pages/GestionFrais/frais/frais.component';
import {GestionPersonnelAdminComponent} from '../pages/structure/gestion-personnel-admin/gestion-personnel-admin.component';

import { CandidatComponent } from '../pages/GestionEtudiants/candidat/candidat.component';
import { CandidatInfosComponent } from '../pages/GestionEtudiants/candidat-infos/candidat-infos.component';
import { CadidatSpecialiteComponent } from '../pages/GestionEtudiants/candidat/cadidat-specialite/cadidat-specialite.component';
import { CandidatAcademieComponent } from '../pages/GestionEtudiants/candidat/candidat-academie/candidat-academie.component';
import { EvenementsComponent } from '../pages/structure/evenements/evenements.component';

import { CandidatureATraiterComponent } from '../pages/pierre/candidature-a-traiter/candidature-a-traiter.component';
import { DossierTraiterComponent } from '../pages/pierre/dossier-traiter/dossier-traiter.component';
import { ListeDesAdmisComponent } from '../pages/pierre/liste-des-admis/liste-des-admis.component';

import { GestionReclamationComponent } from '../pages/structure/gestion-reclamation/gestion-reclamation.component';
import { Header2Component } from '../layouts/full/header2/header2.component';
import { TrombinoscopeComponent } from '../pages/trombinoscope/trombinoscope.component';
import { ReleveNotesComponent } from '../pages/GestionEtudiants/releve-notes/releve-notes.component';

import {ToastModule} from "primeng/toast";
import {DropdownModule} from "primeng/dropdown";
import {PanelModule} from "primeng/panel";
import {DataViewModule} from "primeng/dataview";
import {MessageService} from "primeng/api";


import { SeancesComponent } from '../pages/pierre/seances/seances.component';

import { AnneeComponent } from '../pages/structure/annee/annee.component';

import { QuestionnaireComponent } from '../pages/pierre/questionnaire/questionnaire.component';
import { AddEnseignantComponent } from '../pages/yaya/enseignant/add-enseignant/add-enseignant.component';
import { ModifEnseignantComponent } from '../pages/yaya/enseignant/modif-enseignant/modif-enseignant.component';
import { EnseignantComponent } from '../pages/yaya/enseignant/enseignant.component';
import { AddOptionsComponent } from '../pages/yaya/gestion-options/add-options/add-options.component';
import { DeleteOptionsComponent } from '../pages/yaya/gestion-options/delete-options/delete-options.component';
import { GestionOptionsComponent } from '../pages/yaya/gestion-options/gestion-options.component';
import { ModifOptionsComponent } from '../pages/yaya/gestion-options/modif-options/modif-options.component';
import { AddUesComponent } from '../pages/yaya/gestion-ues/add-ues/add-ues.component';
import { DeleteUesComponent } from '../pages/yaya/gestion-ues/delete-ues/delete-ues.component';
import { GestionUesComponent } from '../pages/yaya/gestion-ues/gestion-ues.component';
import { ModifUesComponent } from '../pages/yaya/gestion-ues/modif-ues/modif-ues.component';
import { FiliereComponent } from '../pages/yaya/GestionFilieres/filiere/filiere.component'; // -- Yaya
import { AddFiliereComponent } from '../pages/yaya/GestionFilieres/add-filiere/add-filiere.component';
import { ModifFiliereComponent } from '../pages/yaya/GestionFilieres/modif-filiere/modif-filiere.component';
import { AddPersonnelComponent } from '../pages/yaya/personnel-admin/add-personnel/add-personnel.component';
import { PersonnelAdminComponent } from '../pages/yaya/personnel-admin/personnel-admin.component';
import { PersonnelAdministratifComponent } from '../pages/yaya/personnel-administratif/personnel-administratif.component';
import { YayaComponent } from '../pages/yaya/yaya.component';
import { ListStructureComponent } from '../pages/structure/list-structure/list-structure.component';
import { SingleStructureComponent } from '../pages/structure/single-structure/single-structure.component';
import { ServiceComponent } from '../pages/departement/service/service.component';
import { DivisionComponent } from '../pages/departement/service/division/division.component';
import { ParametresComponent } from '../pages/structure/parametres/parametres.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CalculesNotesGeneraleComponent } from '../pages/calcules-notes-generale/calcules-notes-generale.component';
import { MonMenuComponent } from '../pages/mon-menu/mon-menu.component';
import { ListDesInscritsComponent } from '../pages/pierre/list-des-inscrits/list-des-inscrits.component';
import { ListNomAdmisComponent } from '../pages/pierre/list-nom-admis/list-nom-admis.component';
import { GdepartementsComponent } from '../pages/structure/affectations/gdepartements/gdepartements.component';
import { GenseignantsComponent } from '../pages/structure/affectations/genseignants/genseignants.component';
import { GpersonnelsComponent } from '../pages/structure/affectations/gpersonnels/gpersonnels.component';
import { AttestationComponent } from '../pages/structure/attestation/attestation.component';
import { PlancarriereComponent } from '../pages/structure/carrieres/plancarriere/plancarriere.component';
import { CertificatFrequentationComponent } from '../pages/structure/certificat-frequentation/certificat-frequentation.component';
import { AbsencesComponent } from '../pages/structure/conge-abscence/absences/absences.component';
import { CongesComponent } from '../pages/structure/conge-abscence/conges/conges.component';
import { GrabsenceComponent } from '../pages/structure/conge-abscence/grabsence/grabsence.component';
import { GracongeComponent } from '../pages/structure/conge-abscence/graconge/graconge.component';
import { ModifPersonnelAdmComponent } from '../pages/yaya/personnel-admin/modif-personnel-adm/modif-personnel-adm.component';
import { GestionGradesComponent } from './dad/gestion-grades/gestion-grades.component';
import { EffectiviteEnseignantsComponent } from './heursSupp/effectivite-enseignants/effectivite-enseignants.component';
import { VoirEnseignantEffectiviteComponent } from './heursSupp/voir-enseignant-effectivite/voir-enseignant-effectivite.component';
import { UeAddComponent } from './ue_ec/ue-add/ue-add.component';
import { UeListComponent } from './ue_ec/ue-list/ue-list.component';
import { UeToOptionComponent } from './ue_ec/ue-to-option/ue-to-option.component';
import { UeToTeacherComponent } from './ue_ec/ue-to-teacher/ue-to-teacher.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { GestionOvragesComponent } from '../pages/bibliotheque/gestion-ovrages/gestion-ovrages.component';
// import { ListeAuteursComponent } from '../pages/bibliotheque/liste-auteurs/liste-auteurs.component';
// import { ListeEditeursComponent } from '../pages/bibliotheque/liste-editeurs/liste-editeurs.component';
// import { ListeGenreslivreComponent } from '../pages/bibliotheque/liste-genreslivre/liste-genreslivre.component';
import { LivreDetailComponent } from '../pages/bibliotheque/livre-detail/livre-detail.component';
import { LivresComponent } from '../pages/bibliotheque/livres/livres.component';

import {VersementDesComptablesComponent} from '../pages/Paul/versement-des-comptables/versement-des-comptables.component';
import {ConsultVersementComponent} from '../pages/Paul/consult-versement/consult-versement.component';
import {ConsultEncaissementComponent} from "../pages/Paul/consult-encaissement/consult-encaissement.component";
import {ChargeFsegListComponent} from "../pages/Paul/charge-fseg-list/charge-fseg-list.component";
import {PaiementEtuduantComponent} from "../pages/Paul/paiement-etuduant/paiement-etuduant.component";
import {ConditionPassageComponent} from "../pages/Paul/condition-passage/condition-passage.component";

import {CourriersComponent} from "../pages/aicha/Courrier/courriers/courriers.component";
import {ImputationComponent} from "../pages/aicha/Courrier/imputation/imputation.component";
import {DureeCongesComponent} from "../pages/aicha/duree-conges/duree-conges.component";
import {CongePermissionComponent} from "../pages/aicha/conge-permission/conge-permission/conge-permission..component";
import {GrhCongePermissionComponent} from "../pages/aicha/conge-permission/grh-conge-permission/grh-conge-permission..component";

import {ListPassageComponent} from "../pages/Paul/list-passage/list-passage.component";
import {DemandeEtudiantTraitementComponent} from "../pages/Paul/demande-etudiant-traitement/demande-etudiant-traitement.component";
import {StatistiquesComponent} from "../pages/Paul/statistiques/statistiques.component";
import {AutrePayementComponent} from "../pages/Paul/autre-payement/autre-payement.component";
import {CartesEtudiantComponent} from "../pages/Paul/Scolarite/cartes-etudiant/cartes-etudiant.component";
import {RolesComponent} from "../pages/Paul/roles/roles.component";

import {HistoriquesComponent} from "../pages/Paul/historiques/historiques.component";
import {CourrierStatistiqueComponent} from "../pages/aicha/Courrier/courrier-statistique/courrier.statistique.component";
import {FieldsetModule} from "primeng/fieldset";
import {ChartModule} from "primeng/chart";
import {CvEnseignantComponent} from "../pages/Paul/cv-enseignant/cv-enseignant.component";
import {EvaluationStatistiqueComponent} from "../pages/aicha/evaluation-statistique/evaluation.statistique.component";
import {ValidationStatistiqueComponent} from "../pages/aicha/validation-statistique/validation.statistique.component";
import {EtudiantPasswordResetComponent} from "../pages/Paul/etudiant-password-reset/etudiant-password-reset.component";
import { NotationComponent } from '../pages/notation/notation.component';
import { EmargementsComponent } from '../pages/emargements/emargements.component';

import { CalculeNoteGeneraleEcComponent } from './calcule-note-generale-ec/calcule-note-generale-ec.component';
import {SingleDepartementComponent} from "../pages/departement/single-departement/single-departement.component";
import {ListeEtudiantsComponent} from "../pages/Paul/liste-etudiants/liste-etudiants.component";
import {StudentRankingsComponent} from "../pages/aicha/student-rankings/student-rankings.component";
import {ResponsableGroupeEtudiantsComponent} from "../pages/aicha/responsable-groupe-etudiants/responsable-groupe-etudiants.component";
import {StudentResetPasswordComponent} from "../pages/aicha/student-reset-password/student-reset-password.component";

import {EtatPaiementsComponent} from "../pages/aicha/etat-paiements/etat-paiements.component";
import {CarteEnseignantComponent} from "../pages/aicha/carte-enseignant/carte-enseignant.component";
import {QRCodeModule} from "angular2-qrcode";

import { ListDesNotesCalculComponent } from './list-des-notes-calcul/list-des-notes-calcul.component';
import {ClassesComponent} from "../pages/Paul/classes/classes.component";
import {ClasseEtudiantsComponent} from "../pages/Paul/classe-etudiants/classe-etudiants.component";
import {ProgrammerSeancesComponent} from "../pages/Paul/programmer-seances/programmer-seances.component";
import {CommonModule} from "@angular/common";
import {DeliberationListeComponent} from "../pages/Paul/deliberation-liste/deliberation-liste.component";
import {ListUeNonValiderComponent} from "../pages/Paul/list-passage/list-ue-non-valider/list-ue-non-valider.component";
import {NgSelectConfig, NgSelectModule, ɵs} from "@ng-select/ng-select";

import { ListDesNotesEcCalculComponent } from './list-des-notes-ec-calcul/list-des-notes-ec-calcul.component';
import {ChargeStructuresListComponent} from "../pages/Paul/charge-structures-list/charge-structures-list.component";
import {SallesComponent} from "../pages/Paul/salles/salles.component";
import {EquipementsComponent} from "../pages/Paul/equipements/equipements.component";
import {BatimentsComponent} from "../pages/Paul/batiments/batiments.component";
import {DemandeTransfertExterneComponent} from "../pages/Paul/demande-transfert-externe/demande-transfert-externe.component";
import {MultipleAttestationsComponent} from "../pages/Paul/multiple-attestations/multiple-attestations.component";
import {ParamettrageOptionsComponent} from "../pages/Paul/paramettrage-options/paramettrage-options.component";
import { GestionMendatComponent } from '../pages/pierre/gestion-mendat/gestion-mendat.component';
import {EmpruntComponent} from "../pages/bibliotheque/emprunt/emprunt.component";
import {ForumComponent} from "../pages/Paul/portailAdmin/forum/forum.component";
import {CampusComponent} from '../pages/Paul/portailAdmin/campus/campus.component';
import {CKEditorModule} from 'ng2-ckeditor';
import {ActualitesComponent} from '../pages/Paul/portailAdmin/actualites/actualites.component';
import {InfoVisiteurComponent} from '../pages/Paul/portailAdmin/info-visiteur/info-visiteur.component';
import {OtherPageHandleComponent} from '../pages/Paul/portailAdmin/other-page-handle/other-page-handle.component';
import {PersonnelAdminFormComponent} from "../pages/aicha/personnel/personnel-admin/personnel-admin-form/personnel-admin-form.component";
import {PersonnelAdminListComponent} from "../pages/aicha/personnel/personnel-admin/personnel-admin-list/personnel-admin-list.component";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

import {MatStepperModule} from '@angular/material/stepper';
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {PersonnelAdminViewComponent} from "../pages/aicha/personnel/personnel-admin/personnel-admin-view/personnel-admin-view.component";
import {EnseignantFormComponent} from "../pages/aicha/personnel/enseignant/enseignant-form/enseignant-form.component";
import {EnseignantListComponent} from "../pages/aicha/personnel/enseignant/enseignant-list/enseignant-list.component";
import {EnseignantViewComponent} from "../pages/aicha/personnel/enseignant/enseignant-view/enseignant-view.component";
import {AichaViewComponent} from "../pages/aicha/aicha-view/aicha-view.component";
import {PresentationPersonelComponent} from '../pages/Paul/portailAdmin/presentation-personel/presentation-personel.component';
import { ListeEtudiantsNonInscritComponent } from '../pages/pierre/liste-etudiants-non-inscrit/liste-etudiants-non-inscrit.component';
import { ListeEcsComponent } from '../pages/pierre/liste-ecs/liste-ecs.component';
import { ChargerNotesComponent } from '../pages/Paul/charger-notes/charger-notes.component';
import { ChargerNotesEcComponent } from '../pages/Paul/charger-notes-ec/charger-notes-ec.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    DemoMaterialModule,
    HttpClientModule,
    NgxQRCodeModule,
    UnionModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    AutocompleteLibModule,

    // aiha dev beggin
    ToastModule,
    PanelModule,
    DataViewModule,
    DropdownModule,
    FieldsetModule,
    ChartModule,
    QRCodeModule,
    NgSelectModule,
    CKEditorModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    // CKEditorModule

    // PaginatorModule,
    // aiha dev end

  ],
  // providers: [MessageService,
  providers: [MessageService, NgSelectConfig, ɵs,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  entryComponents: [DialogOverviewExampleDialogComponent, CarteEnseignantComponent],
  exports: [
    SallesComponent,
    AichaViewComponent
  ],
  declarations: [
    StatistiqueComponent,
    GestionMendatComponent,
    StatistiqueComponent,
    GestionInscriptionComponent,
    EvaluationComponent,
    FraisComponent,
    CandidatComponent,
    CandidatInfosComponent,
    CadidatSpecialiteComponent,
    CandidatAcademieComponent,
    ListNomAdmisComponent,
    AnneeComponent,
    EvenementsComponent,
    GestionPersonnelAdminComponent,
    GestionReclamationComponent,
    ListDesInscritsComponent,
    TrombinoscopeComponent,
    ReleveNotesComponent,
    ServiceComponent,
    ParametresComponent,
    DivisionComponent,
    CertificatFrequentationComponent,
    AttestationComponent,
    ModifPersonnelAdmComponent,
    GestionOvragesComponent,
    // ListeAuteursComponent,
    LivresComponent,
    LivreDetailComponent,
    VersementDesComptablesComponent,
    ConsultVersementComponent,
    ConsultEncaissementComponent,
    ChargeFsegListComponent,
    PaiementEtuduantComponent,
    AutrePayementComponent,
    HistoriquesComponent,
    ButtonsComponent,
    GridComponent,
    ListsComponent,
    MenuComponent,
    TabsComponent,
    StepperComponent,
    ExpansionComponent,
    ChipsComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    ProgressComponent,
    DialogComponent,
    DialogOverviewExampleDialogComponent,
    TooltipComponent,
    SnackbarComponent,
    SliderComponent,
    SlideToggleComponent,
    CandidatureATraiterComponent,
    DossierTraiterComponent,
    ListeDesAdmisComponent,
    ListPassageComponent,
    ListeEtudiantsComponent,
    ListeEtudiantsNonInscritComponent,
    StatistiquesComponent,
    SallesComponent,
    EquipementsComponent,

    Header2Component,

    // ----
    AddEnseignantComponent, // -- ok
    ModifEnseignantComponent, // ---
    EnseignantComponent, /// ----
    AddOptionsComponent,
    DeleteOptionsComponent,
    ModifOptionsComponent,
    GestionOptionsComponent,
    AddUesComponent,
    DeleteUesComponent,
    ModifUesComponent,
    GestionUesComponent,
    AddFiliereComponent,
    FiliereComponent,
    ModifFiliereComponent,
    AddPersonnelComponent,
    PersonnelAdminComponent,
    PersonnelAdministratifComponent,
    YayaComponent,
    MonMenuComponent,

    ListStructureComponent,
    SingleDepartementComponent,
    SingleStructureComponent,


    // -- Aïcha beggin
    GdepartementsComponent,
    GenseignantsComponent,
    GpersonnelsComponent,
    PlancarriereComponent,
    AbsencesComponent,
    CongesComponent,
    GrabsenceComponent,
    GracongeComponent,
    CongesComponent,
    CourriersComponent,
    DureeCongesComponent,
    ImputationComponent,
    CongePermissionComponent,
    GrhCongePermissionComponent,
    CourrierStatistiqueComponent,
    ValidationStatistiqueComponent,
    EvaluationStatistiqueComponent,
    StudentRankingsComponent,
    ResponsableGroupeEtudiantsComponent,
    StudentResetPasswordComponent,
    EtatPaiementsComponent,
    CarteEnseignantComponent,
    ClassesComponent,
    ClasseEtudiantsComponent,
    PersonnelAdminFormComponent,
    PersonnelAdminListComponent,
    PersonnelAdminViewComponent,
    EnseignantFormComponent,
    EnseignantListComponent,
    EnseignantViewComponent,
    AichaViewComponent,


    // -- Aïcha end


    QuestionnaireComponent,

    SeancesComponent,
    ProgrammerSeancesComponent,
    // --- DRA & Alou
    EffectiviteEnseignantsComponent,
    VoirEnseignantEffectiviteComponent,
    UeAddComponent,
    UeListComponent,
    ListeEcsComponent,
    UeToOptionComponent,
    UeToTeacherComponent,
    CalculesNotesGeneraleComponent,
    GestionGradesComponent,
    ListDesNotesEcCalculComponent,
    // ListeEditeursComponent,
    // ListeGenreslivreComponent,
    ConditionPassageComponent,
    DemandeEtudiantTraitementComponent,
    CartesEtudiantComponent,
    RolesComponent,
    CvEnseignantComponent,
    EtudiantPasswordResetComponent,
    CalculeNoteGeneraleEcComponent,
    NotationComponent,
    EmargementsComponent,
    ListDesNotesCalculComponent,
    DeliberationListeComponent,
    ListUeNonValiderComponent,
    ChargeStructuresListComponent,
    BatimentsComponent,
    DemandeTransfertExterneComponent,
    MultipleAttestationsComponent,
    ParamettrageOptionsComponent,
    EmpruntComponent,
    ForumComponent,
    CampusComponent,
    ActualitesComponent,
    InfoVisiteurComponent,
    OtherPageHandleComponent,
    PresentationPersonelComponent,
    ChargerNotesComponent,
    ChargerNotesEcComponent
  ]
})
export class MaterialComponentsModule {}
