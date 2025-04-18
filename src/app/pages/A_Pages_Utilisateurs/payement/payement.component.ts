import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FraisService} from '../../../services/GestionFrais/frais.service';
import {PayementService} from '../../../services/Payement/payement.service';
import {GestionFraisService} from '../../../services/gestion-frais.service';
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';
import {Util_fonction} from "../../models/util_fonction";
import * as Util from "util";
declare var $: any;

@Component({
  selector: 'ngx-payement',
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.scss']
})
export class PayementComponent implements OnInit {
    PayementFormGroup: FormGroup;
    PhoneNumberForm: FormGroup;
    numEnter;
    montantToPay;

    payBody;
    payementTitle = '';
    showMotifSelect = false;
    ShowPayementSelect = false;

    structureType;
    motifPayement;
    id_candidat;
    showMotifPayementSelectBow = false;
    containe = null;

    payementData = {
        montantPaye: 6000,
        modePaiement: '',
        motif: '',
    };
    structureID;
    modePay;
    modePaySelect;
    showPayForm = false;
    num;
    numResponse;

    checkNum_spinner = false;
    payLaunch_spinner = false;
    refeschPay = false;
    DirectPay = false;
    SamaToken: any;
    AuthData: Object;
    candidat_montant: number;
    sama_spinner: boolean;
    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private fraisService: GestionFraisService,
                private payementService: PayementService
    ) {
    }

    ngOnInit(): void {
        this.structureType = sessionStorage.getItem('structureType');
        this.id_candidat = sessionStorage.getItem('id_candidat');
        this.initForm();

        if (this.id_candidat !== null) {

            // CAS DE PAYEMENT DIRECT APRES LA PRE-INSCRIPTION OU CANDIDATURE
            this.DirectPay = true;

            this.structureID = sessionStorage.getItem('id_structure');
            this.modePay = false;

            if (this.structureType === 'Institut') {
                this.payementTitle = 'Frais de traitement de dossiers';
            } else {
                this.payementTitle = 'Frais d\'inscription';
            }

            this.showMotifSelect = false;
            this.DeactiveValidator();

        } else {
            this.DirectPay = false;
            // CAS DE PAYEMENT POUR PLUS TARD

            this.showMotifSelect = true;
            this.ActiveValidator();
        }

        // this.handelMotifValidator();
    }

    /***
     * Activation du validator sur champs de sélection du motif de payement!
     * @constructor
     */
    ActiveValidator(){
        // this.showMotifSelect = true;
        this.PayementFormGroup.controls.MotifPayement.setValidators([Validators.required]);
        this.PayementFormGroup.controls.MotifPayement.updateValueAndValidity();
    }

    /***
     * Desactivation du validator sur champs de sélection du motif de payement!
     * @constructor
     */
    DeactiveValidator(){
        // this.showMotifSelect = false;
        this.PayementFormGroup.controls.MotifPayement.reset();
        this.PayementFormGroup.controls.MotifPayement.clearValidators();
        this.PayementFormGroup.controls.MotifPayement.updateValueAndValidity();
    }


    numPayementAlert(){
        //Votre action lorsque le serveur ne repond pas
        this.numEnter = this.PayementFormGroup.controls.NumPayement.value;
        Swal.fire({
            icon: 'warning',
            title: 'Notez bien',
            html: 'soyez sûr que ce numéro <strong>' + this.numEnter + '</strong> est bien le votre. <br> ' +
            'Car tout payement pour un autre compte ne sera remboursé par la structure concerné! ',
        });
    }

    /***
     * POUR LA VERIFICATION DU NUM DE DOSSIER.
     */
    DoMyPayement(Form) {
        /** Vérification du num dans la BD  **/
            // console.log(Form.value.MotifPayement);
        this.checkNum_spinner = true;
        let TypeFraisToPay = '';
        if (this.DirectPay){
            TypeFraisToPay = this.payementTitle;
        } else {
           TypeFraisToPay = Form.value.MotifPayement
        }

        this.num = this.numEnter;
        const body = {num: this.num, typeFrais: TypeFraisToPay};
        console.log(body);
        this.fraisService.getFraisFilter(body).subscribe( checkResp => {
            this.montantToPay = checkResp['frais'];

            // Cas Payement en ligne
            this.payementData.modePaiement = this.modePaySelect;
            this.payementData.montantPaye = this.montantToPay;
            this.payementData.motif = checkResp['typeFrais'];

            console.log(this.payementData);

            this.checkNum_spinner = false;
            this.ShowPayementSelect = true;
        }, checkError => {
            this.checkNum_spinner = false;
            this.ShowPayementSelect = false;
          Util_fonction.AlertMessage(checkError.error.status,checkError.error.message);
        });

    }

    launchPayement(mode) {
        this.payLaunch_spinner = true;
        setTimeout(() => {this.showRefeschPayBtn(); }, 60000);
        switch (mode) {
            case 'nekawari':
                this.modePaySelect = 'nekawari';
                this.payementData.modePaiement = 'nekawari';
                console.log(this.payementData);

                this.PayerNekawari();
                break;
            case 'sama':
                // this.showPayForm = true;
                this.modePaySelect = 'sama';
                this.payementData.modePaiement = 'sama';
                this.candidat_montant = this.payementData.montantPaye

                // SHow Phone Modal
                $('#PhoneNumberFormModal').modal('show');
                $('#PhoneNumberFormModal').appendTo('body');
                // this.showPayementModal();
                break;
            default:
              Util_fonction.AlertMessage(404,"Un problème est survenue lors du traitement. veuillez réessayer!");
                break;

        }
    }

    /**
     * Affiche le boutton de reprendre si l'api payement dure plus 1 min
     */
    showRefeschPayBtn(){
        this.refeschPay = this.payLaunch_spinner;
    }

    PayementAlertModal() {
        let timerInterval;

        Swal.fire({
            title: this.modePaySelect,
            icon: 'success',
            text: this.numResponse,
            timer: 6000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                timerInterval = setInterval(() => {
                    const content = Swal.getContent();
                    if (content) {
                        const b = content.querySelector('b');
                        if (b) {
                            b.textContent = Swal.getTimerLeft().toString();
                        }
                    }
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                // go to home
                this.router.navigate(['/pages/utilisateur/home']);
            }
        });
}


    /** ****************************************************************************
     * ======================== MODULE DE PAYEMENT EN LIGNE ========================
     * *****************************************************************************
     */

    /** ==================================================================
     * Payement par ne ka wari
     * Neka Wari
     * ===================================================================
     * **/
    PayerNekawari() {
        const parametre = 'top=100%, left=450%, width=400, height=500, directories=0, titlebar=0, toolbar=0, location=0, status=0, menubar=0, scrollbars=no, resizable=no';
        const ID_DEVELOPPEUR = 'Vg4pq6s3sDH2NMSuqsJa9cG1JhVVVSiXzNJ4ybrUvCnCM4kislVljWJO3mqSCuh5YMyFggaqlJCel9BO25bTIwPpHLDfot5SzzNc2019113103119990';
        const CLE_DEVELOPPEUR = 'OnrfJ6D1jA2019113103119990';
        const NOM_DU_SITE = 'USSGB';
        const MONTANT_A_PAYER = this.montantToPay;
        const LANGAGE = 'TypeScript';
        window.open('https://d12xwuhjjc4jz2.cloudfront.net/#/api/demo?ID_DEVELOPPEUR='
            + ID_DEVELOPPEUR
            + '&NOM_DU_SITE=' + NOM_DU_SITE
            + '&LANGAGE=' + LANGAGE
            , MONTANT_A_PAYER
            + 'Porte2474Electronique' + CLE_DEVELOPPEUR
            , parametre);

        // Fermeture du Spinner
        this.payLaunch_spinner = false;

        let ind = 0;
        window.addEventListener('message', (event) => {
            if (ind === 0) {
                this.after(event);
                ind = 1;
            } else {
                ind = 1;
            }
        });
    }

    after(event) {
        if (event.origin === 'https://d12xwuhjjc4jz2.cloudfront.net') {
            const confirmation = event.data.split('_-PME-_')[0];
            const MontantPayer = event.data.split('_-PME-_')[1];

            if (confirmation === 'Succès') {
                //Votre action lorsque le paiement est effectué avec succès
                this.savePayement();

            } else if (confirmation === 'ErreurServeur') {
                //Votre action lorsque le serveur ne repond pas
              Util_fonction.AlertMessage(404, "Un problème de serveur est survenu lors du payement, veuillez Vérifier votre connexion puis réessayer!");

            } else if (confirmation === 'PaiementImpossible') {
                //Votre action lorsque le paiement est impossible dû à votre montant
              Util_fonction.AlertMessage(404,"Impossible d'effectuer le payement! vérifier l'etat de votre compte " + this.modePaySelect);

            } else if (confirmation === 'ErreurDuCle') {
                //Votre action lorsqu'il y a erreur avec vos identifiants développeur
            } else if (confirmation === 'Annuler') {
                this.payLaunch_spinner = false;
                //Votre action lorsque le client décide d'annuler le paiement.
            }
        }
    }
    /**
     * ========================FIN MODULE DE PAYEMENT EN LIGNE NEKAWARI===============================
     * ======================================================================================
     */

     PayerSAMA(){
        this.sama_spinner = true;
         let numTel = this.PhoneNumberForm.controls.phone.value;

         // RECUPERATION DU TOKEN SAMA
        this.payementService.SamaAuth().subscribe( samaAuthResponse => {
            this.SamaToken = samaAuthResponse.resultat.token;
            this.AuthData = samaAuthResponse;

            console.log(this.payementData);

            // PAYEMENT SAMA
            this.payementService.SamaPay(this.payementData, this.num, this.id_candidat,numTel,this.SamaToken).subscribe( samaResponse => {
                console.log("samaResponse------------");
                console.log(samaResponse);
                this.sama_spinner = false;
                if (samaResponse.status === 1) {

                    let timerInterval
                    Swal.fire({
                    title: 'PAYEMENT SAMA',
                    html: "Une demande de confirmation vous a été envoyé sur ce numéro: <br> <strong>"+numTel+"</strong>",
                    timer: 30000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                        const content = Swal.getContent()
                        if (content) {
                            const b = content.querySelector('b')
                            if (b) {
                            b.textContent = Swal.getTimerLeft().toString();
                            }
                        }
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                    }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        this.Check_payement();
                        console.log('I was closed by the timer')
                    }
                    });

                } else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Cliquez sur le bouton si vous avez confirmée !',
                        text: ""+samaResponse.msg,
                        allowOutsideClick: false,
                        confirmButtonText: '',
                    });
                }


            }, SamaError =>{
                this.sama_spinner = false;
              Util_fonction.AlertMessage("warning", "Votre payement n'a pas été effectué. Veuillez réessayer!");

            });



        }, AuthSamaError => {
            this.sama_spinner = false;
          Util_fonction.AlertMessage("warning", "Veuillez réssayer sous peu!");
        });

     }

     /***
      * VERIFICATION DU PAYEMENT
      */
     Check_payement() {
         let type = null;
        if (this.payementData.motif === 'Frais de traitement de dossiers'){
            type = 'Dossier';
          } else {
            type = 'Inscription';
          }
         this.payementService.CheckSamaPay(this.num, type).subscribe(resultPay => {

            if (resultPay.toString() !== "Les frais de traitement de dossier n'ont pas été payé") {
                // Payement ok

                Swal.fire({
                    icon: 'success',
                    title: 'Enregistré',
                    text: ""+resultPay,
                }).then((result) => {
                    if (result.isConfirmed) {
                      $('#PhoneNumberFormModal').modal('hide');
                      this.router.navigate(['']);
                    }
                  });
            } else {
                // pas confirmé
              Util_fonction.AlertMessage("warning",resultPay);
            }

         }, errorPay => {
             // ERROR
           Util_fonction.AlertMessage(errorPay.error.status,errorPay.error.message+"<br> Veuillez réessayer!");
         });
     }

    /**
     * -----------------------
     * Save in data Base
     * -----------------------
     */
    savePayement() {
        // payBody ------------------------->
        this.payementService.Pay(this.num, this.payementData).subscribe(payRes => {
            this.numResponse = payRes.toString();
            this.PayementAlertModal();

        }, payerror => {
          Util_fonction.AlertMessage(payerror.error.status,payerror.error.message);
        });
    }

    cancelPay() {
        this.showPayForm = false;
        Swal.fire({
            text: 'Êtes vous sûr de reporter le payement pour plustard ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'non!',
            confirmButtonText: 'Oui, plus tard!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.router.navigate(['']);

            }
        });


    }

    initForm() {
        this.PayementFormGroup = this.formBuilder.group({
            NumPayement: new FormControl(null, Validators.required),
            MotifPayement: new FormControl(null, Validators.required),
        });

        this.PhoneNumberForm = this.formBuilder.group({
            phone: new FormControl(null, Validators.required),
        });


    }

}
