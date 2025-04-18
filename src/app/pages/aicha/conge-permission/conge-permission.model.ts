

export class CongePermissionModel {
  public id: number;
  public id_structure: number;
  public demandeur_id: number;
  public dateDepart: Date;
  public dateRetour?: Date;

  public statut: string;
  public type: string;
  public fichiers_id: any[];
  public motifDemande?: string;
  public motifRejet?: string;
}





