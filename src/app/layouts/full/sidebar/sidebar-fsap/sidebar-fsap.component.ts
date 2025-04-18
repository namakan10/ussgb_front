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
  OnInit
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../../shared/menu-items/menu-items';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PersonnelAdminService } from '../../../../services/GestionPersonnelAdmin/personnel-admin.service';
import {UNIV_FILIERE_S, UNIV_OPTION_S} from "../../../../CONSTANTES";
declare var $: any;


@Component({
  selector: 'app-sidebar-fsap',
  templateUrl: './sidebar-fsap.component.html',
  styleUrls: ['./sidebar-fsap.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidebarFsapComponent implements OnInit {

  univ_fils = UNIV_FILIERE_S;
  univ_opts = UNIV_OPTION_S;
  contente_sub_line = {
    'border-left': '3px solid #1e88e5',
    'border-bottom': '1px solid #cccccc',
    'padding-left': '12px',
  };
  sub_line = {
    'border-left': '1px solid #cccccc',
  };
  // last_sub_line = {
  //   'border-left': '1px solid #cccccc',
  //   'border-bottom': '1px solid #cccccc'
  // };
  small_icon = {
    'font-size': '18.5px'
  };
  mobileQuery: MediaQueryList;
  user: any;
  dateEnCours: any;

  private _mobileQueryListener: () => void;
  AllSeance: any = [];
  expanded = 0;
  // _RECTORAT: boolean =  this.user.structure.type === 'RECTORAT';

  constructor(
    changeDetectorRef: ChangeDetectorRef, private personnelAdminService: PersonnelAdminService,
    media: MediaMatcher,
    private router: Router,
    public menuItems: MenuItems
  ) {
    if (sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user.users.enseignant) {
        const link = '/enseignant/';
        const id = this.user.users.enseignant.id;
        this.personnelAdminService.getAllSeance(link, id).subscribe((res) => {
          this.AllSeance = res;
        });
      }
    }

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  deconnection() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('dateEnCours');
    this.user = null;
    this.navigateHome();
  }

  navigateHome() {
    this.router.navigate(['/pages/utilisateur/home']);
    // window.location.reload();
  }

  statistique() {
    // this.router.navigate(['/statistique']);
    this.router.navigate(['/statistiques']);
  }

  gestionInscription(param , type) {
    this.router.navigate(['/gestionInscription'], { queryParams: { param: param, type: type }});
  }

  gestionVersement() {
    this.router.navigate(['/gestionVersement']);
  }

  AutrePayementEtudiant() {
    this.router.navigate(['/etudiant/autrePayements']);
  }

  listeEtudiants() {
    this.router.navigate(['/Etudiant/liste_etudiants']);
  }
  gestionFrais() {
    this.router.navigate(['/gestionFrais']);
  }

  listCENOU() {
    this.router.navigate(['/list_CENOU']);
  }
  listPassage() {
    this.router.navigate(['/Liste_Passage']);
  }

  chargeFseglist() {
    this.router.navigate(['/etudiant/chargeList']);
  }

  historique() {
    this.router.navigate(['/Structure/Historiques']);
  }

  gestionReclamationEtudiants() {
    this.router.navigate(['/etudiant/reclamations']);
  }

  // statistiqueCourrier(){
  //   this.router.navigate(['structure',this.user.structure.id,'statistique-courrier']);
  // }

  statistiqueValidation(){
    this.router.navigate(['structure',this.user.structure.id,'statistique-validation']);
  }

  statistiqueEvaluation(){
    this.router.navigate(['structure',this.user.structure.id,'statistique-evaluation']);
  }

  gestionAdminReclamationEtudiants() {
    this.router.navigate(['/Gestion_Reclamation_Etudiant']);
  }

  gestionAdminDemandeEtudiants() {
    this.router.navigate(['/Traitement_demande_etudiant']);
  }

  MyStructures() {
    this.router.navigate(['/structures']);
  }

  GestionStructures() {
    this.router.navigate(['/gestionStructures']);
  }

  GestionDepartements() {
    this.router.navigate(['/structure/departements']);
  }


  gestionSpecialite() {
    this.router.navigate(['/Specialites_candidat']);
  }

  gestionAcademie() {
    this.router.navigate(['/Academie_candidat']);
  }

  gestionsAnnees() {
    this.router.navigate(['/structure/annee']);
  }

  gestionService() {
    this.router.navigate(['/structure/service']);
  }
  gestionDivision() {
    this.router.navigate(['/structure/divisision']);
  }

  gestionFilieres() {
    this.router.navigate(['/structure/filiere']);
  }
  gestionOptions() {
    this.router.navigate(['/structure/options']);
  }

  gestionParametre() {
    this.router.navigate(['/structure/parametres']);
  }
  gestionEvements() {
    this.router.navigate(['/evements']);
  }

  gestionConditonPassage() {
    this.router.navigate(['/Condition_Passage']);
  }

  releveNote() {
    this.router.navigate(['/etudiants/releve_Note']);
  }
  certificatFrequent() {
    this.router.navigate(['/etudiants/Certificat_frequentation']);
  }
  Attestation() {
    this.router.navigate(['/etudiants/Attestation']);
  }

  gestionStructures() {
    this.router.navigate(['/structures']);
  }
  droit_Access() {
    this.router.navigate(['/structure/personnelAdministratifs_Access']);
  }
  getionRole() {
    this.router.navigate(['/structure/Gestion_Role']);
  }
  onItemSelected(value) {
    if (this.expanded === value) {
      this.expanded = 0;
    } else {
      this.expanded = value;
    }
  }

  navigatePreInscription () {
    this.router.navigate(['/pages/utilisateur/pre-inscription']);
  }

  navigatePayement() {
    this.router.navigate(['/pages/utilisateur/payement']);
  }

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

  gestionSeance() {
    this.router.navigate(['/seances']);
  }

  // gestionQuestion() {
  //   this.router.navigate(['/gestion-question']);
  // }

  GoToEvaluationGestion() {
    this.router.navigate(['/evaluation']);
  }

  GoToGestionOvrage() {
    this.router.navigate(['/Biliotheque/gestionOvrages']);
  }
  chargeStructureslist() {
    this.router.navigate(['/etudiant/chargeList']);
  }
  GoToOvrage() {
    this.router.navigate(['/Biliotheque/Ovrages']);
  }

  GoToEtudiantPassReset() {
    this.router.navigate(['/Etudiant/Reinitialisation_passe']);
  }

  candidatureATraiter() {
    if (sessionStorage.getItem('dateEnCours')) {
      this.dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
      this.router.navigate(['/candidature_a_traiter', this.dateEnCours.anneeScolaire, this.user.structure.id]);
    }
  }

  dossiersTraiter(approbation) {
    if (sessionStorage.getItem('dateEnCours')) {
      this.dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
      this.router.navigate(['/dossier_traiter', this.dateEnCours.anneeScolaire, this.user.structure.id, approbation]);
    }
  }

  nonAdmisList() {
    if (sessionStorage.getItem('dateEnCours')) {
      this.dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
      this.router.navigate(['/nom_admis', this.dateEnCours.anneeScolaire, this.user.structure.id]);
    }
  }


  GestionCourriers(){
    this.router.navigate(['structure',this.user.structure.id,'courriers']);
  }

  GestionCourrierImputation(){
    this.router.navigate(['structure',this.user.structure.id,'courrier-imputations']);
  }

  GestionDureeConges(){
    this.router.navigate(['structure',this.user.structure.id,'duree-conges']);
  }

  GestionCongePermissionGRH(){
    this.router.navigate(['structure',this.user.structure.id,'grh-conge-permission']);
  }

  GestionConge(){
    this.router.navigate(['structure',this.user.structure.id,'conges']);
  }

  GestionAbsences(){
    this.router.navigate(['structure',this.user.structure.id,'absences']);
  }

  GestionGrhAbsences(){
    this.router.navigate(['structure',this.user.structure.id,'grh-absences']);
  }

  GestionGrhConges(){
    this.router.navigate(['structure',this.user.structure.id,'grh-conges']);
  }

  AffectationPersonnels(){
    this.router.navigate(['affectations/structure',this.user.structure.id,'personnels']);
  }

  AffectationEnseignants(){
    this.router.navigate(['affectations/structure',this.user.structure.id,'enseignants']);
  }


  AffectationDepartements(){
    this.router.navigate(['affectations/structure',this.user.structure.id,'departements']);
  }
  PlanCarriere(){
    this.router.navigate(['structure',this.user.structure.id,'plan-de-carrieres']);
  }

  carteEtudiant(){
    this.router.navigate(['Scolarite/Carte_Etudiants']);
  }





  admis(admis) {
    if (sessionStorage.getItem('dateEnCours')) {
      this.dateEnCours = JSON.parse(sessionStorage.getItem('dateEnCours'));
      this.router.navigate(['/liste_des_admis', this.dateEnCours.anneeScolaire, this.user.structure.id, admis]);
    }
  }

  ListInscrit() {
    this.router.navigate(['/liste_des_inscrits']);
  }

  affichePersonnel(){
    this.router.navigate(['/structure',this.user.structure.id,'personnel']);
  }


  afficheEnseignants(type){
    // this.router.navigate(['/structure/Enseignant']);
    this.router.navigate(['/structure/Enseignant/'+type]);
  }

  gestionScolariteEtudiant(){
    this.router.navigate(['/Payement/Etudiant_Frais_Due']);

  }

  studentResetPassword(){
    this.router.navigate(['student-reset-password']);
  }

  responsableGroupeEtudiants(){
    this.router.navigate(['responsable-groupe-etudiants']);
  }

  hasRoleComptable() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_COMPTABLE' || item['nom'] === 'ROLE_CHEF_COMPTABLE' || item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }


  hasRoleChefComptable() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_CHEF_COMPTABLE' || item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }

  hasRoleEnseignant() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_ENSEIGNANT' || item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }

  hasRoleSecretaire() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if ((item['nom'] === 'ROLE_INSCRIPTION') || (item['nom'] === 'ROLE_SP') || (item['nom'] === 'ROLE_ADMIN')) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }


  hasRolecourrier() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_COURRIER') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolesegal() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_SEGAL') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolerecteur() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === ' ROLE_RECTUER') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolevrecteur() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_VRECTEUR') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolesecretairesegal() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_SECRETAIRE_SEGAL') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolesrh() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_SRH') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolefinance() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_FINANCE') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRolescolariterectorat() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_SCOLARITE_RECTORAT') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleGestionUE() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_TABLEAU_BOARD' || item['nom'] === 'ROLE_CHEFDPT' || item['nom'] === 'ROLE_SP' || item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }
  hasRoleDashBord() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_TABLEAU_BOARD') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleStatistique() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_TABLEAU_BOARD' || item['nom'] === 'ROLE_SP' || item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }
  hasRoleEtudiants() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_ETUDIANT') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }

  hasRoleAdmin() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleAdminRectorat() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_RECTEUR') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }

  ShowEMploi() {
    $('#staticBackdrop12').modal('show');
    $('#staticBackdrop12').appendTo('body');
  }


//by dad
  claculeNotes() {
    this.router.navigate(['/calculeGenrale']);
  }

  //by dad
  claculeNotesEc() {
    this.router.navigate(['/calcule-ec']);
  }

  ListNotesCalcul() {
    this.router.navigate(['/list-notes-calcules']);
  }

  seeVoirEffectivite() {
    this.router.navigate(['/voir-enseignantEffectivite']);
  }

  effectiviter() {
    this.router.navigate(['/effectivie/enseignant']);
  }
  GoToAddUe() {
    this.router.navigate(['/ueAdd']);
  }
  GoToUeList() {
    this.router.navigate(['/ueList']);
  }
  GoToEnseignantCV() {
    this.router.navigate(['/Structure/Enseignant/CV']);
  }
//end dad


  hasRoleSecretairePrincipale() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_SP') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }

  hasRoleTraitementReclamation() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_CHEFDPT' || item['nom'] === 'ROLE_NOTER'|| item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  hasRoleNoter() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_NOTER') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }

  hasRoleEffectiviteHeures() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_VERIFICATEUR' || item['nom'] === 'ROLE_TABLEAU_BORD' || item['nom'] === 'ROLE_CHEF_COMPTABLE' || item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }
  hasRoleGRH() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_GRH') {
          hasRole = true;

        }
      });
      return hasRole;
    }
  }

  hasRoleDoyens() {
    let hasRole = false;
    if (this.user['users'] ) {
      this.user['users']['roles'].forEach(item => {
        if (item['nom'] === 'ROLE_DOYEN' || item['nom'] === 'ROLE_ADMIN') {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }


}
