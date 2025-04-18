import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TrombinoscopeService} from '../../services/trombinoscope.service';
import Swal from 'sweetalert2';
import {Util_fonction} from '../models/util_fonction';
import {_HTTP} from '../../CONSTANTES';
import {StructureService} from '../../services/structure.service';

@Component({
    selector: 'app-trombinoscope',
    templateUrl: './trombinoscope.component.html',
    styleUrls: ['./trombinoscope.component.css']
})
export class TrombinoscopeComponent implements OnInit {
    _https = 'https://';
    _http = 'http://';
    User_searchForm: FormGroup;
    onlyEtudiant: boolean = false;
    onlyEnseignant: boolean = false;
    onlyPersonnel: boolean = false;
    formValid_spinner = false;
    user = JSON.parse(sessionStorage.getItem('user'));
    _RECTORAT: boolean = this.user.structure.type === 'RECTORAT';
    structureId = this.user.structure.id;

    Body = {
        typeUtilisateur: null,
        nom: null,
        prenom: null,
        idStructure: null,
        anneeScolaire: null
    };
    _All: boolean = false;
    ListResponse: any[];
    NotFind: boolean = false;
    Structures;

    constructor(
        private formBuilder: FormBuilder,
        private trombineService: TrombinoscopeService,
        private structureService: StructureService) {
    }

    ngOnInit() {
        // if (this._RECTORAT){
        //   this.GetAllStructures();
        // }else {
        this.GetStructureAnnee();
        // }
        this.initForm();

    }

    AnneeStructure;
    structure;

    GetStructureAnnee() {
        this.structureService.getStuctureAnnees(this.structureId).subscribe(
            (res) => {
                this.AnneeStructure = res;
            });
    }

    spinnerS: boolean = false;

    GetAllStructures() {
        this.spinnerS = true;
        this.structureService.getStuctures().subscribe(
            (res) => {
                this.Structures = res.filter(s => s.type !== 'RECTORAT');
                this.spinnerS = false;
            });
    }

    spinner: boolean = false;

    structureChange(event) {
        this.spinner = true;
        this.structureId = this.structure;
        const struct = this.Structures.find(s => +s.id === +this.structure);

        this.GetStructureAnnee();
    }

    User_searchFormSubmit() {
        this.formValid_spinner = true;
        this.hideAll();
        this.Body.typeUtilisateur = this.User_searchForm.controls.type_user.value;
        this.Body.nom = this.User_searchForm.controls.nom.value;
        this.Body.prenom = this.User_searchForm.controls.prenom.value;
        this.Body.idStructure = this.structureId;
        this.Body.anneeScolaire = this.User_searchForm.controls.anneeS.value;

        console.log(this.Body);

        if (this.Body.typeUtilisateur === 'all') {
            this._All = true;
            /* this.onlyEtudiant = true;
             this.onlyEnseignant= true;
             this.onlyPersonnel= true;*/
        }

        if (this.Body.typeUtilisateur === 'ETUDIANT') {
            this.onlyEtudiant = true;
        }

        if (this.Body.typeUtilisateur === 'ENSEIGNANT') {
            this.onlyEnseignant = true;
        }

        if (this.Body.typeUtilisateur === 'PERSONNEL_ADMINISTRATIF') {
            this.onlyPersonnel = true;
        }
        this.LaunchSearch();
    }

    hideAll() {
        this._All = false;
        this.onlyEtudiant = false;
        this.onlyEnseignant = false;
        this.onlyPersonnel = false;
    }

    LaunchSearch() {
        this.trombineService.getTrombinoscop(this.Body).subscribe(Trombresponse => {

            this.formValid_spinner = false;
            if (Trombresponse.content.length > 0) {
                this.NotFind = false;
                this.ListResponse = Trombresponse.content;
            } else {
                this.NotFind = true;
                this.ListResponse = Trombresponse.content;
            }
        }, error => {
            console.log('getTrombinoscop error', error);
            this.formValid_spinner = false;
            Util_fonction.AlertMessage(error.error.status, error.error.message);
        });
    }

    initForm() {
        this.User_searchForm = this.formBuilder.group({
            type_user: new FormControl(null, Validators.required),
            nom: new FormControl(null),
            prenom: new FormControl(null),
            anneeS: new FormControl(null, Validators.required),

        });
    }

    onImageErrorPrint(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = '../assets/images/carte/profile.png';
    }

}
