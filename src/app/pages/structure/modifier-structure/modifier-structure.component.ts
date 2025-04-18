import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { StructureService } from 'app/services/structure.service';
// import {UtilsService} from "../../../services/utils.service";
import {REST_URL} from "../../REST_URL";
import {FilesService} from "../../../services/files.service";

@Component({
  selector: 'ngx-modifier-structure',
  templateUrl: './modifier-structure.component.html',
  styleUrls: ['./modifier-structure.component.scss']
})
export class ModifierStructureComponent implements OnInit {
// cration du formulaire reactive
  modifStructureForm: FormGroup;
  structure = {
    id: '',
    nom: '',
    type: '',
    sigle: '',
    adresse: '',
    premierRespondable: '',
    secondRespondable: '',
    logo: '',
  };
  structureNotFound = null;
  FileToUpload;
  ID;
  FileName;
  AnneeScolaire;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private structureService: StructureService,
              private router: Router,
              // private utilsService: UtilsService,
              private filesService: FilesService
  )  { }

  ngOnInit(): void {
    // recuperation de l'id à travers l'url
    const id = this.route.snapshot.paramMap.get("id");
    this.ID = id;
    this.getStructure(id);
    this.getStructureCurrentAnnee(id);
    this.initForm();
  }

  getStructureCurrentAnnee(id) {
    this.structureService.getStructureCurrentAnnee(id).subscribe(AnneeRes =>{
      this.AnneeScolaire = AnneeRes['anneeScolaire'];
    },errorAnne =>{
      // this.utilsService.showToast("warning", 'Allert',
      //     errorAnne['error']);
    });
  }

  // declaration d'une url vide pour la preview de l'image
  url = '';
  // le block n'est visible qu'après avoir selectionner une image
  prewiewImg = 'display:none';
  onselectFile(e){
    if(e.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
      this.RenameFile(e, 'logo');
    }
    this.prewiewImg = 'display:block';
  }

  RenameFile(e, type) {
    let fichier: File = e.target.files[0];
    let ext = fichier.name.substr(fichier.name.lastIndexOf('.') + 1);
    const newFile: File = new File([fichier], Math.floor(Date.now() / 1000) + "." + ext, {type: fichier.type});
    this.FileToUpload = newFile;
    this.FileName = newFile.name;
  }

  uploadLogo(){
    let fd = new FormData();
    fd.append('file', this.FileToUpload);
    let fileUploadInformation = "logo" + "__" + "structure" + "__" + this.ID + "__" + this.AnneeScolaire;

    this.filesService.uploadFile(fd, fileUploadInformation).subscribe(
      res => {

      },
      error => {
        // this.utilsService.showToast("warning", 'Erreur',
        //     error['error']);
      }
    );
  }

  /* foction initialisation du formulaire pour le lier au template dans ng OnInit
   avec remplissage du formulaire avec les donnée de la structre a modifier*/
  initForm(){
    this.modifStructureForm = this.formBuilder.group({
      id: new FormControl(this.ID),
      nom: new FormControl(this.structure.nom, [Validators.required]),
      type: [this.structure.type, Validators.required],
      sigle: new FormControl(this.structure.sigle,[Validators.required]),
      adresse: new FormControl(this.structure.adresse,[Validators.required]),
      logo: new FormControl(this.FileName),
      premierRespondable: new FormControl(null),
      secondRespondable: new FormControl(null),
    });

    if (this.structure.logo != ""){
      this.url = REST_URL+"/files/logo/"+this.structure.logo;
      this.prewiewImg = 'display:block';
    }
  }

  getStructure(id) {
    this.structureService.getStucture(id).subscribe(
      res => {
        // this.handleSuccessfulResponse(res);
      },
      error => {
        this.structureNotFound = "Cette structure n'existe pas !";
      }
    )
  }

  modifierStructure() {
    this.uploadLogo();
    this.structure.id = this.ID;
    this.structure.nom = this.modifStructureForm.value['nom'];
    this.structure.type = this.modifStructureForm.value['type'];
    this.structure.sigle = this.modifStructureForm.value['sigle'];
    this.structure.adresse = this.modifStructureForm.value['adresse'];
    this.structure.premierRespondable = this.modifStructureForm.value['premierRespondable'];
    this.structure.secondRespondable = this.modifStructureForm.value['secondRespondable'];
    this.structure.logo = this.FileName;


    console.log(this.structure);

    this.structureService.updateStructure(this.structure).subscribe(
      response => {
        this.router.navigate(['/pages', 'structure']);
      }, error => {
      }
    )
  }

}
