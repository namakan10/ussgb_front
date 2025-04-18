import {Validators} from "@angular/forms";


export class Courrier {

  public id: number;
  public numeroCourrier: string;
  public dateCorrespondance: Date;
  public object: string;
  public expediteur: string;
//  public structure : any;
  public numeroRefArr : any;
  public courrierARepondre : string = "";
  public numeroRefDep : string;
  public annee : string;
  public mois : string;
  public dateCreation : Date;
  public dateArrivee: Date;
  public dateDepart : Date;
  public destinateur : string;
  public statut : string;

  public etat: string = "ATTENTE";
  public fichiers_id : any[] = [];
  public fichiersList : any[] = [];
  public repondre: boolean=true;
  public structure_id: number;
  public type: string;

}

export class CourrierImpute{
  public services_id: any;
  public courrier_id: any;
  public rapport:  boolean = false;
  public reprendre:  boolean = false;
  public suiteDonnee:  boolean = false;
  public exploitation:  boolean = false;
  public instance: boolean = false;
  public projetDeResponse:  boolean = false;
  public information:  boolean = false;
  public etudeAvis:  boolean = false;
  public suivre:  boolean = false;
  public disposition:  boolean = false;
  public remise:  boolean = false;
  public parler:  boolean = false;
  public urgent:  boolean = false;
  public photoCopier:  boolean = false;
  public classe:  boolean = false;
  public attribution:  boolean = false;
  public diffusion: boolean = false;
  public servicesSupplementaires: string;
  public date: Date = new Date();
  public detail: string = "";
  public observation: string = "";
}

export class Fichiers {
  public id: number = 0;
  public annee: string;
  public fileUrl: string;
  public nom: string;
  public typeFichier: string;
}
