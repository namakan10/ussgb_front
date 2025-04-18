import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit,
  HostBinding,
  Input,
  OnInit, enableProdMode
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PersonnelAdminService } from '../../../services/GestionPersonnelAdmin/personnel-admin.service';
import {UNIV_FILIERE_S, UNIV_OPTION_S} from "../../../CONSTANTES";
import {environment} from "../../../../environments/environment";
declare var $: any;


@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  animations: [
    trigger("indicatorRotate", [
      state("collapsed", style({ transform: "rotate(0deg)" })),
      state("expanded", style({ transform: "rotate(180deg)" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4,0.0,0.2,1)")
      ),
    ]),
  ],
})
export class AppSidebarComponent implements OnDestroy, OnInit {
  univ_fils = UNIV_FILIERE_S;
  univ_opts = UNIV_OPTION_S;
  env = environment.env;
  user = JSON.parse(sessionStorage.getItem("user"));

  _RECTORAT: boolean = this.user.structure.type === "RECTORAT";

  contente_sub_line = {
    "border-left": "3px solid #1e88e5",
    "border-bottom": "1px solid #cccccc",
    "padding-left": "12px",
  };
  sub_line = {
    "border-left": "1px solid #cccccc",
  };
  // last_sub_line = {
  //   'border-left': '1px solid #cccccc',
  //   'border-bottom': '1px solid #cccccc'
  // };
  small_icon = {
    "font-size": "18.5px",
  };
  mobileQuery: MediaQueryList;
  dateEnCours: any;

  private _mobileQueryListener: () => void;
  AllSeance: any = [];
  expanded = 0;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private personnelAdminService: PersonnelAdminService,
    media: MediaMatcher,
    private router: Router,
    public menuItems: MenuItems
  ) {
    if (
      this.user.users.typeUtilisateur === "ENSEIGNANT" ||
      this.user.users.typeUtilisateur === "VACATAIRE"
    ) {
      const link = "/enseignant/";
      const id = this.user.users.personnel.id;
      this.personnelAdminService.getAllSeance(link, id).subscribe((res) => {
        console.log("azerty", res);
        this.AllSeance = res;
      });
    }

    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  envFSEG() {
    return environment.production;
  }

  deconnection() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("dateEnCours");
    this.user = null;
    this.navigateHome();
  }

  navigateHome() {
    this.router.navigate(["/pages/utilisateur/home"]);
    // window.location.reload();
  }

  statistique() {
    // this.router.navigate(['/statistique']);
    this.router.navigate(["/statistiques"]);
  }

  gestionInscription(param, type) {
    this.router.navigate(["/gestionInscription"], {
      queryParams: { param: param, type: type },
    });
  }

  gestionVersement() {
    this.router.navigate(["/gestionVersement"]);
  }

  AutrePayementEtudiant() {
    this.router.navigate(["/etudiant/autrePayements"]);
  }

  gestionFrais() {
    this.router.navigate(["/gestionFrais"]);
  }

  listCENOU() {
    this.router.navigate(["/list_CENOU"]);
  }
  listPassage() {
    this.router.navigate(["/Liste_Passage"]);
  }

  chargeStructureslist() {
    this.router.navigate(["/etudiant/chargeList"]);
  }

  historique() {
    this.router.navigate(["/Structure/Historiques"]);
  }

  gestionReclamationEtudiants() {
    this.router.navigate(["/etudiant/reclamations"]);
  }

  // statistiqueCourrier(){
  //   this.router.navigate(['structure',this.user.structure.id,'statistique-courrier']);
  // }

  statistiqueValidation() {
    this.router.navigate([
      "structure",
      this.user.structure.id,
      "statistique-validation",
    ]);
  }

  statistiqueEvaluation() {
    this.router.navigate([
      "structure",
      this.user.structure.id,
      "statistique-evaluation",
    ]);
  }

  gestionAdminReclamationEtudiants() {
    this.router.navigate(["/Gestion_Reclamation_Etudiant"]);
  }

  gestionAdminDemandeExterne() {
    this.router.navigate(["/Traitement_Transfert_Externe"]);
  }
  gestionAdminDemandeEtudiants() {
    this.router.navigate(["/Traitement_demande_etudiant"]);
  }
  listeEtudiants() {
    this.router.navigate(["/Etudiant/liste_etudiants"]);
  }
  listeEtudiantsNonInscrit() {
    this.router.navigate(["/Etudiant/liste_etudiants-non-inscrit"]);
  }

  MyStructures() {
    this.router.navigate(["/structures"]);
  }

  GestionStructures() {
    this.router.navigate(["/gestionStructures"]);
  }
  GestionInfrastructure() {
    this.router.navigate(["structure/" + this.user.structure.id + "/batiment"]);
  }

  GestionDepartements() {
    this.router.navigate(["/structure/departements"]);
  }

  GestionBatiment() {
    this.router.navigate(["/structure/batiments"]);
  }

  GestionSalle() {
    this.router.navigate(["/structure/salles"]);
  }

  GestionEquipement() {
    this.router.navigate(["/structure/equipements"]);
  }

  gestionSpecialite() {
    this.router.navigate(["/Specialites_candidat"]);
  }

  gestionAcademie() {
    this.router.navigate(["/Academie_candidat"]);
  }

  gestionsAnnees() {
    this.router.navigate(["/structure/annee"]);
  }

  gestionsMandats() {
    this.router.navigate(["/gestion/mandat"]);
  }

  gestionService() {
    this.router.navigate(["/structure/service"]);
  }
  gestionDivision() {
    this.router.navigate(["/structure/divisision"]);
  }

  gestionFilieres() {
    this.router.navigate(["/structure/filiere"]);
  }

  gestionOptions() {
    this.router.navigate(["/structure/options"]);
  }

  gestionParametrageOptions() {
    this.router.navigate(["/options/optionsparamettrage"]);
  }

  gestionParametre() {
    this.router.navigate(["/structure/parametres"]);
  }

  gestionEvements() {
    this.router.navigate(["/evements"]);
  }

  gestionConditonPassage() {
    this.router.navigate(["/Condition_Passage"]);
  }

  deliberation_liste() {
    this.router.navigate(["/deliberation_liste"]);
  }

  Gotoclasse() {
    this.router.navigate(["/Classes"]);
  }

  releveNote() {
    this.router.navigate(["/etudiants/releve_Note"]);
  }

  certificatFrequent() {
    this.router.navigate(["/etudiants/Certificat_frequentation"]);
  }

  Attestation() {
    // this.router.navigate(['/etudiants/Attestation']);
    this.router.navigate(["/multiple_attestations"], {
      queryParams: { param: "attest" },
    });
    // this.navigation.navigateByUrl("/multiple_attestations", {state: {datas : []}});
  }

  Diplome() {
    // this.router.navigate(['/etudiants/Attestation']);
    this.router.navigate(["/multiple_attestations"], {
      queryParams: { param: "diplo" },
    });
    // this.navigation.navigateByUrl("/multiple_attestations", {state: {datas : []}});
  }

  gestionStructures() {
    this.router.navigate(["/structures"]);
  }

  droit_Access() {
    this.router.navigate(["/structure/personnelAdministratifs_Access"]);
  }

  getionRole() {
    this.router.navigate(["/structure/Gestion_Role"]);
  }

  onItemSelected(value) {
    if (this.expanded === value) {
      this.expanded = 0;
    } else {
      this.expanded = value;
    }
  }

  navigatePreInscription() {
    this.router.navigate(["/pages/utilisateur/pre-inscription"]);
  }

  navigatePayement() {
    this.router.navigate(["/pages/utilisateur/payement"]);
  }

  navigateAuthPage() {
    this.router.navigate(["/auth/login"]);
  }

  // REDIRECTIONS WHEN USER IS CONNECT
  GoToStructureGestion() {
    this.router.navigate(["/pages/structure"]);
  }

  GoToCandidatsGestion() {
    this.router.navigate(["/pages/candidat"]);
  }

  gestionSeance() {
    this.router.navigate(["/seances"]);
  }

  gestionQuestion() {
    this.router.navigate(["/gestion-question"]);
  }

  GoToEvaluationGestion() {
    this.router.navigate(["/evaluation"]);
  }

  GoToGestionOvrage() {
    this.router.navigate(["/Biliotheque/gestionOvrages"]);
  }

  GoToOvrage() {
    this.router.navigate(["/Biliotheque/Ovrages"]);
  }
  GoToOvrageEmprun() {
    this.router.navigate(["/Biliotheque/Emprunts"]);
  }

  GoToEtudiantPassReset() {
    this.router.navigate(["/Etudiant/Reinitialisation_passe"]);
  }

  candidatureATraiter() {
    if (sessionStorage.getItem("dateEnCours")) {
      this.dateEnCours = JSON.parse(sessionStorage.getItem("dateEnCours"));
      this.router.navigate([
        "/candidature_a_traiter",
        this.dateEnCours.anneeScolaire,
        this.user.structure.id,
      ]);
    }
  }

  dossiersTraiter(approbation) {
    if (sessionStorage.getItem("dateEnCours")) {
      this.dateEnCours = JSON.parse(sessionStorage.getItem("dateEnCours"));
      this.router.navigate([
        "/dossier_traiter",
        this.dateEnCours.anneeScolaire,
        this.user.structure.id,
        approbation,
      ]);
    }
  }

  nonAdmisList() {
    if (sessionStorage.getItem("dateEnCours")) {
      this.dateEnCours = JSON.parse(sessionStorage.getItem("dateEnCours"));
      this.router.navigate([
        "/nom_admis",
        this.dateEnCours.anneeScolaire,
        this.user.structure.id,
      ]);
    }
  }

  GestionCourriers() {
    this.router.navigate(["structure", this.user.structure.id, "courriers"]);
  }

  ProgrammerSeance() {
    this.router.navigate(["programmerSeances"]);
  }

  GestionCourrierImputation() {
    this.router.navigate([
      "structure",
      this.user.structure.id,
      "courrier-imputations",
    ]);
  }

  GestionDureeConges() {
    this.router.navigate(["structure", this.user.structure.id, "duree-conges"]);
  }

  GestionCongePermissionGRH() {
    this.router.navigate([
      "structure",
      this.user.structure.id,
      "grh-conge-permission",
    ]);
  }

  GestionConge() {
    this.router.navigate(["structure", this.user.structure.id, "conges"]);
  }

  GestionAbsences() {
    this.router.navigate(["structure", this.user.structure.id, "absences"]);
  }

  GestionGrhAbsences() {
    this.router.navigate(["structure", this.user.structure.id, "grh-absences"]);
  }

  GestionGrhConges() {
    this.router.navigate(["structure", this.user.structure.id, "grh-conges"]);
  }

  AffectationPersonnels() {
    this.router.navigate([
      "affectations/structure",
      this.user.structure.id,
      "personnels",
    ]);
  }

  goToPersonnels(): void {
    this.router.navigate(["structure", this.user.structure.id, "personnels"]);
  }

  goToEnseignants(type: string): void {
    this.router.navigate(["structure", this.user.structure.id, type]);
  }

  AffectationEnseignants() {
    this.router.navigate([
      "affectations/structure",
      this.user.structure.id,
      "enseignants",
    ]);
  }

  AffectationDepartements() {
    this.router.navigate([
      "affectations/structure",
      this.user.structure.id,
      "departements",
    ]);
  }
  PlanCarriere() {
    this.router.navigate([
      "structure",
      this.user.structure.id,
      "plan-de-carrieres",
    ]);
  }

  carteEtudiant() {
    this.router.navigate(["Scolarite/Carte_Etudiants"]);
  }

  classementEtudiants() {
    this.router.navigate(["classement-des-etudiants"]);
  }

  studentResetPassword() {
    this.router.navigate(["student-reset-password"]);
  }

  aPaiements() {
    this.router.navigate(["etat-paiements"]);
  }

  responsableGroupeEtudiants() {
    this.router.navigate(["responsable-groupe-etudiants"]);
  }

  admis(admis) {
    if (sessionStorage.getItem("dateEnCours")) {
      this.dateEnCours = JSON.parse(sessionStorage.getItem("dateEnCours"));
      this.router.navigate([
        "/liste_des_admis",
        this.dateEnCours.anneeScolaire,
        this.user.structure.id,
        admis,
      ]);
    }
  }

  ListInscrit() {
    this.router.navigate(["/liste_des_inscrits"]);
  }

  affichePersonnel() {
    // this.router.navigate(['/structure/personnel']);
    this.router.navigate(["/structure", this.user.structure.id, "personnel"]);
  }
  afficheEnseignants(type) {
    // this.router.navigate(['/structure/Enseignant']);
    this.router.navigate(["/structure/Enseignant/" + type]);
  }

  gestionScolariteEtudiant() {
    this.router.navigate(["/Payement/Etudiant_Frais_Due"]);
  }
  gestionPortailForum() {
    this.router.navigate(["/portail/forum"]);
  }
  gestionPortailActualite() {
    this.router.navigate(["/portail/actualite"]);
  }
  gestionPortailCampus() {
    this.router.navigate(["/portail/campus"]);
  }
  gestionPortailInfoVisiteur() {
    this.router.navigate(["/portail/info-visiteur"]);
  }

  gestionPortailOther() {
    this.router.navigate(["/portail/gestion-autres-pages"]);
  }
  gestionPresentation() {
    this.router.navigate(["/portail/PresentationPersonel"]);
  }

  hasRoleComptable() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_COMPTABLE" ||
          item["nom"] === "ROLE_CHEF_COMPTABLE" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRectoratComptable() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_COMPTABLE" ||
          item["nom"] === "ROLE_CHEF_COMPTABLE" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleChefComptable() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_CHEF_COMPTABLE" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleEnseignant() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_ENSEIGNANT" ||
          "ROLE_VACATAIRE" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }
  hasRoleModerateurForum() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_MODERATEUR" || item["nom"] === "ROLE_ADMIN") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleSecretaire() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_INSCRIPTION" ||
          item["nom"] === "ROLE_SP" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasProgrammerSeance() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_EVA1") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolecourrier() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_COURRIER") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolesegal() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_SEGAL") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolerecteur() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === " ROLE_RECTUER") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolevrecteur() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_VRECTEUR") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolesecretairesegal() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_SECRETAIRE_SEGAL") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolesrh() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_SRH") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolefinance() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_FINANCE") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolescolariterectorat() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_SCOLARITE_RECTORAT") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleGestionUE() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_TABLEAU_BORD" ||
          item["nom"] === "ROLE_CHEFDPT" ||
          item["nom"] === "ROLE_SP" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }
  hasRoleDashBord() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_TABLEAU_BORD") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleStatistique() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_TABLEAU_BORD" ||
          item["nom"] === "ROLE_SP" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }
  hasRoleEtudiants() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_ETUDIANT") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleAdmin() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_ADMIN") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleAdminRectorat() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_RECTEUR") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }
  hasPatrimoine() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_RECTEUR" ||
          item["nom"] === "ROLE_ADMIN" ||
          item["nom"] === "ROLE_DG" ||
          item["nom"] === "ROLE_DGA" ||
          item["nom"] === "ROLE_VRECTEUR"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  ShowEMploi() {
    $("#staticBackdrop12").modal("show");
    $("#staticBackdrop12").appendTo("body");
  }

  //by dad
  claculeNotes() {
    this.router.navigate(["/calculeGenrale"]);
  }

  //by dad
  claculeNotesEc() {
    this.router.navigate(["/calcule-ec"]);
  }

  seeVoirEffectivite() {
    this.router.navigate(["/voir-enseignantEffectivite"]);
  }

  effectiviter() {
    this.router.navigate(["/effectivie/enseignant"]);
  }
  GoToAddUe() {
    this.router.navigate(["/ueAdd"]);
  }
  GoToUeList() {
    this.router.navigate(["/ueList"]);
  }
  GoToEcList() {
    this.router.navigate(["/ecList"]);
  }
  GoToEnseignantCV() {
    this.router.navigate(["/Structure/Enseignant/CV"]);
  }
  //end dad

  hasRoleSecretairePrincipale() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_ADMIN" || item["nom"] === "ROLE_SP") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }
  hasRoleRectoratStaff() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_DG" ||
          item["nom"] === "ROLE_DGA" ||
          item["nom"] === "ROLE_RECTEUR" ||
          item["nom"] === "ROLE_VRECTEUR"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleClassmPwdRespGEtudiant() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_SP" || item["nom"] === "ROLE_ADMIN") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleTraitementReclamation() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_CHEFDPT" ||
          item["nom"] === "ROLE_NOTER" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleNoter() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_NOTER" || item["nom"] === "ROLE_VACATAIRE") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleEffectiviteHeures() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_VERIFICATEUR" ||
          item["nom"] === "ROLE_TABLEAU_BORD" ||
          item["nom"] === "ROLE_CHEF_COMPTABLE" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }
  hasRoleGRH() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_GRH") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleDoyens() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (item["nom"] === "ROLE_DOYEN" || item["nom"] === "ROLE_ADMIN") {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleBibliotheque() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_BIBLIOTHECAIRE" ||
          item["nom"] === "ROLE_ADMIN"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleDeliberation() {
    let hasRole = false;
    if (this.user["users"]) {
      this.user["users"]["roles"].forEach((item) => {
        if (
          item["nom"] === "ROLE_SCOLARITE" ||
          item["nom"] === "ROLE_ADMIN" ||
          item["nom"] === "ROLE_NOTER" ||
          item["nom"] === "ROLE_CHEFDPT" ||
          item["nom"] === "ROLE_TABLEAU_BORD"
        ) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  ListNotesCalcul() {
    this.router.navigate(["/list-notes-calcules"]);
  }

  ListNotesEcCalcul() {
    this.router.navigate(["/list-notes-ec-calcul"]);
  }

  ChargerNotes() {
    this.router.navigate(["/charger-notes"]);
  }

  ChargerNotesEc() {
    this.router.navigate(["/charger-notes-ec"]);
  }
}
