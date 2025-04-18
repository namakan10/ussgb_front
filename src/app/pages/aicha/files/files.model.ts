export class Files {
  id: number;
  annee_scolaire?: string;
  file: FormData;
  file_owner?: string;
  file_type: string;
  owner_id?: string;
}

export class FileModel {
  fileUrl: string;
  id: number;
  nom: string;
  typeFichier: string;
}
