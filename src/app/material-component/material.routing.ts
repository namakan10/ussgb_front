import { Routes } from '@angular/router';

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
import { DialogComponent } from './dialog/dialog.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';

import { ProfilComponent } from '../pages/A_Pages_Utilisateurs/profil/profil.component';
import { EvaluationComponent } from '../pages/A_Pages_Utilisateurs/evaluation/evaluation.component';
import { GestionInscriptionComponent } from '../pages/A_Pages_Utilisateurs/gestion-inscription/gestion-inscription.component';
import { StatistiqueComponent } from '../pages/A_Pages_Utilisateurs/statistique/statistique.component';

import { HomeComponent } from '../pages/A_Pages_Utilisateurs/home/home.component';

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
import { TrombinoscopeComponent } from '../pages/trombinoscope/trombinoscope.component';
import { ReleveNotesComponent } from '../pages/GestionEtudiants/releve-notes/releve-notes.component';

import { SeancesComponent } from '../pages/pierre/seances/seances.component';
import { DivisionComponent } from '../pages/departement/service/division/division.component';
import { ServiceComponent } from '../pages/departement/service/service.component';
import { SingleDepartementComponent } from '../pages/departement/single-departement/single-departement.component';
// import { FiliereComponent } from '../pages/GestionFilieres/filiere/filiere.component';
import { MonMenuComponent } from '../pages/mon-menu/mon-menu.component';
import { QuestionnaireComponent } from '../pages/pierre/questionnaire/questionnaire.component';
import { AnneeComponent } from '../pages/structure/annee/annee.component';
import { AttestationComponent } from '../pages/structure/attestation/attestation.component';
import { CertificatFrequentationComponent } from '../pages/structure/certificat-frequentation/certificat-frequentation.component';
import { ParametresComponent } from '../pages/structure/parametres/parametres.component';
import { SingleStructureComponent } from '../pages/structure/single-structure/single-structure.component';

import { GestionOptionsComponent } from '../pages/yaya/gestion-options/gestion-options.component';
import { PersonnelAdminComponent } from '../pages/yaya/personnel-admin/personnel-admin.component';
import { FiliereComponent } from '../pages/yaya/GestionFilieres/filiere/filiere.component';
import { CalculesNotesGeneraleComponent } from '../pages/calcules-notes-generale/calcules-notes-generale.component';
import { ListDesInscritsComponent } from '../pages/pierre/list-des-inscrits/list-des-inscrits.component';
import { ListNomAdmisComponent } from '../pages/pierre/list-nom-admis/list-nom-admis.component';
import { GdepartementsComponent } from '../pages/structure/affectations/gdepartements/gdepartements.component';
import { GenseignantsComponent } from '../pages/structure/affectations/genseignants/genseignants.component';
import { GpersonnelsComponent } from '../pages/structure/affectations/gpersonnels/gpersonnels.component';
import { PlancarriereComponent } from '../pages/structure/carrieres/plancarriere/plancarriere.component';
import { AbsencesComponent } from '../pages/structure/conge-abscence/absences/absences.component';
import { CongesComponent } from '../pages/structure/conge-abscence/conges/conges.component';
import { GrabsenceComponent } from '../pages/structure/conge-abscence/grabsence/grabsence.component';
import { GracongeComponent } from '../pages/structure/conge-abscence/graconge/graconge.component';
import { ListStructureComponent } from '../pages/structure/list-structure/list-structure.component';
import { AddEnseignantComponent } from '../pages/yaya/enseignant/add-enseignant/add-enseignant.component';
import { AddPersonnelComponent } from '../pages/yaya/personnel-admin/add-personnel/add-personnel.component';
import { GestionGradesComponent } from './dad/gestion-grades/gestion-grades.component';
import { EffectiviteEnseignantsComponent } from './heursSupp/effectivite-enseignants/effectivite-enseignants.component';
import { VoirEnseignantEffectiviteComponent } from './heursSupp/voir-enseignant-effectivite/voir-enseignant-effectivite.component';
import { UeAddComponent } from './ue_ec/ue-add/ue-add.component';
import { UeListComponent } from './ue_ec/ue-list/ue-list.component';
import { UeToOptionComponent } from './ue_ec/ue-to-option/ue-to-option.component';
import { UeToTeacherComponent } from './ue_ec/ue-to-teacher/ue-to-teacher.component';
import { ModifPersonnelAdmComponent } from '../pages/yaya/personnel-admin/modif-personnel-adm/modif-personnel-adm.component';
import { GestionOvragesComponent } from '../pages/bibliotheque/gestion-ovrages/gestion-ovrages.component';
import { LivresComponent } from '../pages/bibliotheque/livres/livres.component';
import {VersementDesComptablesComponent} from '../pages/Paul/versement-des-comptables/versement-des-comptables.component';
import {ChargeFsegListComponent} from "../pages/Paul/charge-fseg-list/charge-fseg-list.component";
import {PaiementEtuduantComponent} from "../pages/Paul/paiement-etuduant/paiement-etuduant.component";
import {ConditionPassageComponent} from "../pages/Paul/condition-passage/condition-passage.component";

import {ListPassageComponent} from "../pages/Paul/list-passage/list-passage.component";
import {DemandeEtudiantTraitementComponent} from "../pages/Paul/demande-etudiant-traitement/demande-etudiant-traitement.component";
import {StatistiquesComponent} from "../pages/Paul/statistiques/statistiques.component";
import {CourrierStatistiqueComponent} from "../pages/aicha/Courrier/courrier-statistique/courrier.statistique.component";
import {GrhCongePermissionComponent} from "../pages/aicha/conge-permission/grh-conge-permission/grh-conge-permission..component";
import {CongePermissionComponent} from "../pages/aicha/conge-permission/conge-permission/conge-permission..component";
import {CourriersComponent} from "../pages/aicha/Courrier/courriers/courriers.component";
import {ImputationComponent} from "../pages/aicha/Courrier/imputation/imputation.component";
import {DureeCongesComponent} from "../pages/aicha/duree-conges/duree-conges.component";
import {AutrePayementComponent} from "../pages/Paul/autre-payement/autre-payement.component";
import {CartesEtudiantComponent} from "../pages/Paul/Scolarite/cartes-etudiant/cartes-etudiant.component";
import {RolesComponent} from "../pages/Paul/roles/roles.component";
import {ValidationStatistiqueComponent} from "../pages/aicha/validation-statistique/validation.statistique.component";
import {EvaluationStatistiqueComponent} from "../pages/aicha/evaluation-statistique/evaluation.statistique.component";
import {HistoriquesComponent} from "../pages/Paul/historiques/historiques.component";
import {CvEnseignantComponent} from "../pages/Paul/cv-enseignant/cv-enseignant.component";
import {EtudiantPasswordResetComponent} from "../pages/Paul/etudiant-password-reset/etudiant-password-reset.component";
import {CarteEnseignantsComponent} from "../pages/Paul/carte-enseignants/carte-enseignants.component";
import {ModifEnseignantComponent} from "../pages/yaya/enseignant/modif-enseignant/modif-enseignant.component";

import { CalculeNoteGeneraleEcComponent } from './calcule-note-generale-ec/calcule-note-generale-ec.component';
import { EmargementsComponent } from '../pages/emargements/emargements.component';
import { NotationComponent } from '../pages/notation/notation.component';
import {EnseignantComponent} from "../pages/yaya/enseignant/enseignant.component";
import {ListDesNotesCalculComponent} from "./list-des-notes-calcul/list-des-notes-calcul.component";
import {environment} from "../../environments/environment";
import {ListeEtudiantsComponent} from "../pages/Paul/liste-etudiants/liste-etudiants.component";
import {DeliberationListeComponent} from "../pages/Paul/deliberation-liste/deliberation-liste.component";
import { ListDesNotesEcCalculComponent } from './list-des-notes-ec-calcul/list-des-notes-ec-calcul.component';
import {ChargeStructuresListComponent} from "../pages/Paul/charge-structures-list/charge-structures-list.component";
import {SallesComponent} from "../pages/Paul/salles/salles.component";
import {EquipementsComponent} from "../pages/Paul/equipements/equipements.component";
import {BatimentsComponent} from "../pages/Paul/batiments/batiments.component";
import {DemandeTransfertExterneComponent} from "../pages/Paul/demande-transfert-externe/demande-transfert-externe.component";
import {MultipleAttestationsComponent} from "../pages/Paul/multiple-attestations/multiple-attestations.component";
import {ProgrammerSeancesComponent} from "../pages/Paul/programmer-seances/programmer-seances.component";
import {ClassesComponent} from "../pages/Paul/classes/classes.component";
import {ParamettrageOptionsComponent} from "../pages/Paul/paramettrage-options/paramettrage-options.component";
import { GestionMendatComponent } from '../pages/pierre/gestion-mendat/gestion-mendat.component';
import {EmpruntComponent} from "../pages/bibliotheque/emprunt/emprunt.component";
import {ForumComponent} from "../pages/Paul/portailAdmin/forum/forum.component";
import {CampusComponent} from '../pages/Paul/portailAdmin/campus/campus.component';
import {ActualitesComponent} from '../pages/Paul/portailAdmin/actualites/actualites.component';
import {InfoVisiteurComponent} from '../pages/Paul/portailAdmin/info-visiteur/info-visiteur.component';
import {OtherPageHandleComponent} from '../pages/Paul/portailAdmin/other-page-handle/other-page-handle.component';
import {PersonnelAdminFormComponent} from "../pages/aicha/personnel/personnel-admin/personnel-admin-form/personnel-admin-form.component";
import {PersonnelAdminListComponent} from "../pages/aicha/personnel/personnel-admin/personnel-admin-list/personnel-admin-list.component";
import {PersonnelAdminViewComponent} from "../pages/aicha/personnel/personnel-admin/personnel-admin-view/personnel-admin-view.component";
import {EnseignantListComponent} from "../pages/aicha/personnel/enseignant/enseignant-list/enseignant-list.component";
import {EnseignantFormComponent} from "../pages/aicha/personnel/enseignant/enseignant-form/enseignant-form.component";
import {EnseignantViewComponent} from "../pages/aicha/personnel/enseignant/enseignant-view/enseignant-view.component";
import {PresentationPersonelComponent} from '../pages/Paul/portailAdmin/presentation-personel/presentation-personel.component';
import { ListeEtudiantsNonInscritComponent } from '../pages/pierre/liste-etudiants-non-inscrit/liste-etudiants-non-inscrit.component';
import { ListeEcsComponent } from '../pages/pierre/liste-ecs/liste-ecs.component';
import { ChargerNotesComponent } from '../pages/Paul/charger-notes/charger-notes.component';
import { ChargerNotesEcComponent } from '../pages/Paul/charger-notes-ec/charger-notes-ec.component';



export const MaterialRoutes: Routes =
  environment.env !== "fsap"
    ? [
        {
          path: "portail/forum",
          component: ForumComponent,
        },
        {
          path: "portail/gestion-autres-pages",
          component: OtherPageHandleComponent,
        },
        {
          path: "portail/campus",
          component: CampusComponent,
        },
        {
          path: "portail/actualite",
          component: ActualitesComponent,
        },
        {
          path: "portail/PresentationPersonel",
          component: PresentationPersonelComponent,
        },
        {
          path: "portail/info-visiteur",
          component: InfoVisiteurComponent,
        },
        {
          path: "gestion/mandat",
          component: GestionMendatComponent,
        },
        {
          path: "structure/:id_structure/departement/:id_departement",
          component: SingleDepartementComponent,
        },
        {
          // path: 'departement/:id_departement/filiere',
          path: "structure/filiere",
          component: FiliereComponent,
        },
        {
          //---   YAYA
          path: "structures",
          component: MonMenuComponent,
        },
        {
          path: "gestionStructures",
          component: ListStructureComponent,
        },
        {
          path: "structure/Enseignant/:type",
          component: EnseignantComponent,
        },
        {
          path: "structure/ajouter_enseignant/:type",
          component: AddEnseignantComponent,
        },
        {
          path: "structure/modifier_enseingnant/:id/:type",
          component: ModifEnseignantComponent,
        },
        {
          path: "programmerSeances",
          component: ProgrammerSeancesComponent,
        },

        // {
        //   path: 'structure/Enseignant',
        //   component: EnseignantComponentBAK,
        // },
        // {
        //   path: 'structure/ajouter_enseignant',
        //   component: EnseignantFormComponent,
        // },
        // {
        //   path: 'structure/modifier_enseingnant/:id',
        //   component: ModifEnseignantComponent,
        // },

        {
          path: "structure/departements",
          component: SingleDepartementComponent,
        },
        {
          path: "structure/equipements",
          component: EquipementsComponent,
        },
        {
          path: "structure/salles",
          component: SallesComponent,
        },
        {
          path: "structure/batiments",
          component: BatimentsComponent,
        },
        {
          path: "structure/options",
          component: GestionOptionsComponent,
        },
        {
          path: "options/optionsparamettrage",
          component: ParamettrageOptionsComponent,
        },
        {
          path: "structure/:id/personnel",
          component: PersonnelAdminComponent,
        },

        //---  end YAYA

        {
          path: "candidature_a_traiter/:annee_scolaire/:id_structure",
          component: CandidatureATraiterComponent,
        },
        {
          path: "dossier_traiter/:annee_scolaire/:id_structure/:approbation",
          component: DossierTraiterComponent,
        },
        {
          path: "nom_admis/:annee_scolaire/:id_structure",
          component: ListNomAdmisComponent,
        },
        {
          path: "liste_des_admis/:annee_scolaire/:id_structure/:admis",
          component: ListeDesAdmisComponent,
        },
        {
          path: "structure/service",
          component: ServiceComponent,
        },
        {
          path: "structure/divisision",
          component: DivisionComponent,
        },
        {
          path: "profil",
          component: ProfilComponent,
        },
        {
          path: "admin/home",
          component: HomeComponent,
        },
        {
          path: "evaluation",
          component: EvaluationComponent,
        },
        {
          path: "gestion-question",
          component: QuestionnaireComponent,
        },
        {
          path: "statistique",
          component: StatistiqueComponent,
        },
        {
          path: "statistiques",
          component: StatistiquesComponent,
        },
        {
          path: "gestionInscription",
          component: GestionInscriptionComponent,
        },
        {
          path: "gestionVersement",
          component: VersementDesComptablesComponent,
        },
        {
          path: "liste_des_inscrits",
          component: ListDesInscritsComponent,
        },
        {
          path: "seances",
          component: SeancesComponent,
        },
        {
          path: "gestionFrais",
          component: FraisComponent,
        },
        {
          path: "list_CENOU",
          component: CandidatComponent,
        },
        {
          path: "voir_candidat/:id",
          component: CandidatInfosComponent,
        },
        {
          path: "structure/personnelAdministratifs_Access",
          component: GestionPersonnelAdminComponent,
        },

        {
          path: "structure/AjoutPersonnel",
          component: AddPersonnelComponent,
        },

        {
          path: "structure/modifier_personnel/:idPerso",
          component: ModifPersonnelAdmComponent,
        },
        {
          path: "Specialites_candidat",
          component: CadidatSpecialiteComponent,
        },
        {
          path: "Academie_candidat",
          component: CandidatAcademieComponent,
        },
        {
          path: "structure/annee",
          component: AnneeComponent,
        },
        {
          path: "evements",
          component: EvenementsComponent,
        },
        {
          path: "Gestion_Reclamation_Etudiant",
          component: GestionReclamationComponent,
        },
        {
          path: "Classes",
          component: ClassesComponent,
        },
        {
          path: "trombinoscope",
          component: TrombinoscopeComponent,
        },
        {
          path: "etudiants/releve_Note",
          component: ReleveNotesComponent,
        },
        {
          path: "etudiants/Certificat_frequentation",
          component: CertificatFrequentationComponent,
        },
        {
          path: "etudiants/Attestation",
          component: AttestationComponent,
        },
        {
          path: "multiple_attestations",
          component: MultipleAttestationsComponent,
        },
        {
          path: "multiple_diplomes",
          component: MultipleAttestationsComponent,
        },
        {
          path: "structure/parametres",
          component: ParametresComponent,
        },
        {
          path: "etudiant/chargeList",
          component: ChargeFsegListComponent,
        },
        {
          path: "etudiant/chargeStructuresList",
          component: ChargeStructuresListComponent,
        },
        {
          path: "Condition_Passage",
          component: ConditionPassageComponent,
        },
        {
          path: "button",
          component: ButtonsComponent,
        },
        {
          path: "grid",
          component: GridComponent,
        },
        {
          path: "lists",
          component: ListsComponent,
        },
        {
          path: "menu",
          component: MenuComponent,
        },
        {
          path: "tabs",
          component: TabsComponent,
        },
        {
          path: "stepper",
          component: StepperComponent,
        },
        {
          path: "expansion",
          component: ExpansionComponent,
        },
        {
          path: "chips",
          component: ChipsComponent,
        },
        {
          path: "toolbar",
          component: ToolbarComponent,
        },
        {
          path: "progress-snipper",
          component: ProgressSnipperComponent,
        },
        {
          path: "progress",
          component: ProgressComponent,
        },
        {
          path: "dialog",
          component: DialogComponent,
        },
        {
          path: "tooltip",
          component: TooltipComponent,
        },
        {
          path: "snackbar",
          component: SnackbarComponent,
        },
        {
          path: "slider",
          component: SliderComponent,
        },
        {
          path: "slide-toggle",
          component: SlideToggleComponent,
        },
        //-- Aïcha Beggin
        {
          path: "structure/:id/grh-conge-permission",
          component: GrhCongePermissionComponent,
        },
        {
          path: "structure/:id/conge-permission",
          component: CongePermissionComponent,
        },
        {
          path: "structure/:id/absences",
          component: AbsencesComponent,
        },
        {
          path: "structure/:id/grh-absences",
          component: GrabsenceComponent,
        },
        {
          path: "structure/:id/grh-conges",
          component: GracongeComponent,
        },
        {
          path: "affectations/structure/:id/personnels",
          component: GpersonnelsComponent,
        },
        {
          path: "affectations/structure/:id/enseignants",
          component: GenseignantsComponent,
        },
        {
          path: "affectations/structure/:id/departements",
          component: GdepartementsComponent,
        },
        {
          path: "structure/:id/plan-de-carrieres",
          component: PlancarriereComponent,
        },
        {
          path: "structure/:id/courriers",
          component: CourriersComponent,
        },

        {
          path: "structure/:id/courrier-imputations",
          component: ImputationComponent,
        },
        {
          path: "structure/:id/duree-conges",
          component: DureeCongesComponent,
        },
        {
          path: "structure/statistique-courrier",
          component: CourrierStatistiqueComponent,
        },
        {
          path: "structure/:id/statistique-validation",
          component: ValidationStatistiqueComponent,
        },
        {
          path: "structure/:id/statistique-evaluation",
          component: EvaluationStatistiqueComponent,
        },

        {
          path: "structure/:id/personnels",
          component: PersonnelAdminListComponent,
        },
        {
          path: "structure/:id/personnels/nouveau",
          component: PersonnelAdminFormComponent,
        },
        {
          path: "structure/:id/personnels/modifier/:personnelId",
          component: PersonnelAdminFormComponent,
        },
        {
          path: "structure/:id/personnels/detail/:personnelId",
          component: PersonnelAdminViewComponent,
        },

        {
          path: "structure/:id/:type",
          component: EnseignantListComponent,
        },
        {
          path: "structure/:id/:type/nouveau",
          component: EnseignantFormComponent,
        },
        {
          path: "structure/:id/:type/modifier/:personnelId",
          component: EnseignantFormComponent,
        },
        {
          path: "structure/:id/:type/detail/:personnelId",
          component: EnseignantViewComponent,
        },

        // {
        //   path: 'structure/:id/personnels/detail/:personnelId',
        //   component: AichaViewComponent,
        // },

        // -- Aicha End

        // -- Dra & Alouka
        {
          path: "ueAdd",
          component: UeAddComponent,
        },
        {
          path: "ueList",
          component: UeListComponent,
        },
        {
          path: "ecList",
          component: ListeEcsComponent,
        },
        {
          path: "ueToTeacher",
          component: UeToTeacherComponent,
        },
        {
          path: "ueToOption",
          component: UeToOptionComponent,
        },
        {
          path: "calculeGenrale",
          component: CalculesNotesGeneraleComponent,
        },
        {
          path: "gestion-grades",
          component: GestionGradesComponent,
        },
        {
          path: "voir-enseignantEffectivite",
          component: VoirEnseignantEffectiviteComponent,
        },
        {
          path: "effectivie/enseignant",
          component: EffectiviteEnseignantsComponent,
        },
        {
          path: "Biliotheque/gestionOvrages",
          component: GestionOvragesComponent,
        },
        {
          path: "Biliotheque/Ovrages",
          component: LivresComponent,
        },
        {
          path: "Biliotheque/Livre_detail",
          component: LivresComponent,
        },
        {
          path: "Biliotheque/Emprunts",
          component: EmpruntComponent,
        },
        {
          path: "Payement/Etudiant_Frais_Due",
          component: PaiementEtuduantComponent,
        },
        {
          path: "Liste_Passage",
          component: ListPassageComponent,
        },
        {
          path: "deliberation_liste",
          component: DeliberationListeComponent,
        },
        {
          path: "Etudiant/liste_etudiants",
          component: ListeEtudiantsComponent,
        },
        {
          path: "Etudiant/liste_etudiants-non-inscrit",
          component: ListeEtudiantsNonInscritComponent,
        },
        {
          path: "Traitement_demande_etudiant",
          component: DemandeEtudiantTraitementComponent,
        },
        {
          path: "Traitement_Transfert_Externe",
          component: DemandeTransfertExterneComponent,
        },
        {
          path: "etudiant/autrePayements",
          component: AutrePayementComponent,
        },
        {
          path: "Scolarite/Carte_Etudiants",
          component: CartesEtudiantComponent,
        },
        {
          path: "structure/Gestion_Role",
          component: RolesComponent,
        },
        {
          path: "Structure/Historiques",
          component: HistoriquesComponent,
        },
        {
          path: "Structure/Enseignant/CV",
          component: CvEnseignantComponent,
        },
        {
          path: "Etudiant/Reinitialisation_passe",
          component: EtudiantPasswordResetComponent,
        },
        {
          path: "calcule-ec",
          component: CalculeNoteGeneraleEcComponent,
        },
        {
          path: "charger-notes",
          component: ChargerNotesComponent,
        },
        {
          path: "charger-notes-ec",
          component: ChargerNotesEcComponent,
        },
        {
          path: "emargements/:id",
          component: EmargementsComponent,
        },
        {
          path: "notation/:id",
          component: NotationComponent,
        },
        {
          path: "list-notes-calcules",
          component: ListDesNotesCalculComponent,
        },
        {
          path: "list-notes-ec-calcul",
          component: ListDesNotesEcCalculComponent,
        },
      ]
    : /* ==============================================*/
      /* ================= For FSAP ==================*/
      /* ============================================*/
      [
        {
          path: "Etudiant/liste_etudiants",
          component: ListeEtudiantsComponent,
        },
        {
          path: "Etudiant/liste_etudiants-non-inscrit",
          component: ListeEtudiantsNonInscritComponent,
        },
        {
          path: "structure/:id_structure/departement/:id_departement",
          component: SingleDepartementComponent,
        },
        {
          path: "structure/filiere",
          component: FiliereComponent,
        },
        {
          path: "structures",
          component: MonMenuComponent,
        },

        {
          path: "structure/Enseignant/:type",
          component: EnseignantComponent,
        },
        {
          path: "structure/ajouter_enseignant/:type",
          component: AddEnseignantComponent,
        },
        {
          path: "structure/modifier_enseingnant/:id/:type",
          component: ModifEnseignantComponent,
        },
        {
          path: "structure/departements",
          component: SingleDepartementComponent,
        },
        {
          path: "structure/options",
          component: GestionOptionsComponent,
        },
        {
          path: "options/optionsparamettrage",
          component: ParamettrageOptionsComponent,
        },
        {
          path: "structure/:id/personnel",
          component: PersonnelAdminComponent,
        },
        {
          path: "candidature_a_traiter/:annee_scolaire/:id_structure",
          component: CandidatureATraiterComponent,
        },
        {
          path: "dossier_traiter/:annee_scolaire/:id_structure/:approbation",
          component: DossierTraiterComponent,
        },
        {
          path: "nom_admis/:annee_scolaire/:id_structure",
          component: ListNomAdmisComponent,
        },
        {
          path: "liste_des_admis/:annee_scolaire/:id_structure/:admis",
          component: ListeDesAdmisComponent,
        },
        {
          path: "structure/service",
          component: ServiceComponent,
        },
        {
          path: "structure/divisision",
          component: DivisionComponent,
        },
        {
          path: "profil",
          component: ProfilComponent,
        },
        {
          path: "admin/home",
          component: HomeComponent,
        },
        {
          path: "evaluation",
          component: EvaluationComponent,
        },
        // {
        //   path: 'gestion-question',
        //   component: QuestionnaireComponent,
        // },
        {
          path: "statistique",
          component: StatistiqueComponent,
        },
        {
          path: "statistiques",
          component: StatistiquesComponent,
        },
        {
          path: "gestionInscription",
          component: GestionInscriptionComponent,
        },
        {
          path: "gestionVersement",
          component: VersementDesComptablesComponent,
        },
        {
          path: "liste_des_inscrits",
          component: ListDesInscritsComponent,
        },
        // {
        //   path: 'seances',
        //   component: SeancesComponent,
        // },
        {
          path: "gestionFrais",
          component: FraisComponent,
        },
        {
          path: "list_CENOU",
          component: CandidatComponent,
        },
        {
          path: "voir_candidat/:id",
          component: CandidatInfosComponent,
        },
        {
          path: "structure/personnelAdministratifs_Access",
          component: GestionPersonnelAdminComponent,
        },
        {
          path: "structure/AjoutPersonnel",
          component: AddPersonnelComponent,
        },
        {
          path: "structure/modifier_personnel/:idPerso",
          component: ModifPersonnelAdmComponent,
        },
        {
          path: "Specialites_candidat",
          component: CadidatSpecialiteComponent,
        },
        {
          path: "Academie_candidat",
          component: CandidatAcademieComponent,
        },
        {
          path: "structure/annee",
          component: AnneeComponent,
        },
        {
          path: "evements",
          component: EvenementsComponent,
        },
        // {
        //   path: 'Gestion_Reclamation_Etudiant',
        //   component: GestionReclamationComponent,
        // },
        {
          path: "trombinoscope",
          component: TrombinoscopeComponent,
        },
        {
          path: "etudiants/releve_Note",
          component: ReleveNotesComponent,
        },
        {
          path: "etudiants/Certificat_frequentation",
          component: CertificatFrequentationComponent,
        },
        {
          path: "etudiants/Attestation",
          component: AttestationComponent,
        },
        {
          path: "structure/parametres",
          component: ParametresComponent,
        },
        {
          path: "etudiant/chargeList",
          component: ChargeFsegListComponent,
        },
        {
          path: "Condition_Passage",
          component: ConditionPassageComponent,
        },
        // {
        //   path: 'structure/:id/grh-conge-permission',
        //   component: GrhCongePermissionComponent,
        // },
        // {
        //   path: 'structure/:id/conge-permission',
        //   component: CongePermissionComponent,
        // },
        // {
        //   path: 'structure/:id/absences',
        //   component: AbsencesComponent,
        // },
        // {
        //   path: 'structure/:id/grh-absences',
        //   component: GrabsenceComponent,
        // },
        // {
        //   path: 'structure/:id/grh-conges',
        //   component: GracongeComponent,
        // },
        {
          path: "affectations/structure/:id/personnels",
          component: GpersonnelsComponent,
        },
        {
          path: "affectations/structure/:id/enseignants",
          component: GenseignantsComponent,
        },
        {
          path: "affectations/structure/:id/departements",
          component: GdepartementsComponent,
        },
        // {
        //   path: 'structure/:id/plan-de-carrieres',
        //   component: PlancarriereComponent,
        // },
        // {
        //   path: 'structure/:id/courriers',
        //   component: CourriersComponent,
        // },

        // {
        //   path: 'structure/:id/courrier-imputations',
        //   component: ImputationComponent,
        // },
        // {
        //   path: 'structure/:id/duree-conges',
        //   component: DureeCongesComponent,
        // },
        {
          path: "structure/statistique-courrier",
          component: CourrierStatistiqueComponent,
        },
        {
          path: "structure/:id/statistique-validation",
          component: ValidationStatistiqueComponent,
        },
        {
          path: "structure/:id/statistique-evaluation",
          component: EvaluationStatistiqueComponent,
        },
        {
          path: "ueAdd",
          component: UeAddComponent,
        },
        {
          path: "ueList",
          component: UeListComponent,
        },
        {
          path: "ecList",
          component: ListeEcsComponent,
        },
        {
          path: "ueToTeacher",
          component: UeToTeacherComponent,
        },
        {
          path: "ueToOption",
          component: UeToOptionComponent,
        },
        {
          path: "calculeGenrale",
          component: CalculesNotesGeneraleComponent,
        },
        // {
        //   path: 'gestion-grades',
        //   component: GestionGradesComponent,
        // },
        // {
        //   path: 'voir-enseignantEffectivite',
        //   component: VoirEnseignantEffectiviteComponent,
        // },
        {
          path: "effectivie/enseignant",
          component: EffectiviteEnseignantsComponent,
        },
        // {
        //   path: 'Biliotheque/gestionOvrages',
        //   component: GestionOvragesComponent,
        // },
        // {
        //   path: 'Biliotheque/Ovrages',
        //   component: LivresComponent,
        // },
        // {
        //   path: 'Biliotheque/Livre_detail',
        //   component: LivresComponent,
        // },
        {
          path: "Payement/Etudiant_Frais_Due",
          component: PaiementEtuduantComponent,
        },
        {
          path: "Liste_Passage",
          component: ListPassageComponent,
        },
        // {
        //   path: 'Traitement_demande_etudiant',
        //   component: DemandeEtudiantTraitementComponent,
        // },
        {
          path: "etudiant/autrePayements",
          component: AutrePayementComponent,
        },
        {
          path: "Scolarite/Carte_Etudiants",
          component: CartesEtudiantComponent,
        },
        {
          path: "structure/Gestion_Role",
          component: RolesComponent,
        },
        {
          path: "Structure/Historiques",
          component: HistoriquesComponent,
        },
        // {
        //   path: 'Structure/Enseignant/CV',
        //   component: CvEnseignantComponent,
        // },
        {
          path: "Etudiant/Reinitialisation_passe",
          component: EtudiantPasswordResetComponent,
        },
        {
          path: "calcule-ec",
          component: CalculeNoteGeneraleEcComponent,
        },
        {
          path: "emargements/:id",
          component: EmargementsComponent,
        },
        {
          path: "notation/:id",
          component: NotationComponent,
        },
        {
          path: "list-notes-calcules",
          component: ListDesNotesCalculComponent,
        },
        {
          path: "list-notes-ec-calcul",
          component: ListDesNotesEcCalculComponent,
        },
      ];
