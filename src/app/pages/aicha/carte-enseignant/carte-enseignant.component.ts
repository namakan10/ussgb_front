import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartementService } from '../../../services/departement.service';
import { SpecialiteFonctionService } from '../../../services/specialite-fonction.service';
import { StructureService } from '../../../services/structure.service';
import {PersonnelAdminService} from "../../../services/GestionPersonnelAdmin/personnel-admin.service";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import {SpinnerService} from "../../aicha/spinner.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {environment} from "../../../../environments/environment";
import {_HTTP} from "../../../CONSTANTES";
declare var $: any;

@Component({
  selector: 'ngx-enseignant',
  templateUrl: './carte-enseignant.component.html',
  styleUrls: ['./carte-enseignant.component.scss']
})
export class CarteEnseignantComponent implements OnInit {

  user: any;
  select: any;
  _asset_image = environment._ASSET_IMAGE;
  _http = _HTTP;

  now = new Date();

  faceShow=true;

  constructor(
    private router: Router,
    private fonctionSpecialService: SpecialiteFonctionService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private anneeService: StructureService,
    private departementService: DepartementService,
    private personnelService: PersonnelAdminService,
    private refChange: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    public dialogRef: MatDialogRef<CarteEnseignantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  ) {
    console.log("CarteEnseignantComponent ", data)
    this.select = data.enseignant;
    this.user = data.user;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
  }


close(){
    this.dialogRef.close();
}


parseImage(img: string): string {
  if(!img) return;
  return img.includes("public.") ? "https://" + img : "http://" + img ;
}

  carteSpinner: boolean = false;

  printCarte() {
    this.carteSpinner = true;
    const data = document.getElementById('face');
    const dos = document.getElementById('dos');
    const pdf = new jspdf('l', 'mm', [86, 54]);

    html2canvas(data).then(canvas => {
      const imgWidth = 86;
      const pageHeight = 210;
      const imgHeight = 54;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.addPage();

      html2canvas(dos).then(canvas2 => {
        const imgWidth2 = 86;
        const pageHeight2 = 210;
        const imgHeight2 = 54;
        const heightLeft2 = imgHeight2;
        const contentDataURL2 = canvas2.toDataURL('image/png');
        const position2 = 0;
        pdf.addImage(contentDataURL2, 'PNG', 0, position2, imgWidth2, imgHeight2);
        pdf.save(this.now.toISOString()+'_carte_enseignant.pdf');
      });
      this.carteSpinner = false;
    });

    this.carteSpinner = false;
  }



  async printCartedd() {

    const pdf = new jspdf('l', 'mm', [86, 54]);

    const faceData = document.getElementById('face');
    const dosData = document.getElementById('dos');

    const faceCanvas = await html2canvas(faceData);
    const faceDataURL = faceCanvas.toDataURL('image/jpeg');
    pdf.addImage(faceDataURL, 'JPEG', 0, 0, 86, 54);
    pdf.addPage();

    const canvasDos = await html2canvas(dosData);
    const dosDataURL = canvasDos.toDataURL('image/jpeg');
    pdf.addImage(dosDataURL, 'JPEG', 0, 0, 86, 54);

    const isOk = await pdf.save(this.now.toISOString() + '_carte_enseignant.pdf');
    console.log("isOk ===",isOk)

  }

   printCarteOld() {

    /*printJS({
      printable: 'divId',
      type: 'html',
      showModal: true,
      scanStyles: false,
      style: '@page { size: Letter landscape; } @media print { .face {page-break-after: always;}}',
      //maxWidth: 'auto',
      modalMessage: 'Récupération du document ...',
      css: ['assets/aicha/css/only-print.css']
    });
    this.dialogRef.close();*/
  }



  photo(photo) {
    return photo != null ? photo.split('/')[5] : '';
  }

  qrCodeParse(data): string {
    return 'N° Matricule : ' + data.user.numMatricule
      + '\nPrénom et nom : ' + data.prenom + ' ' + data.nom
      + '\nTéléphone : ' + data.user.telephone
      + '\nProfession : ' + data.corps
      + '\nStructure : ' + this.user.structure.nom +' ( ' + this.user.structure.sigle + ' )'
      + '\nDepartement : ' + data.departement.nom;
  }




}
