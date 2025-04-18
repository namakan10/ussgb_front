// modele de donnée pour les structures
export class Structure{
    constructor(
        public nom: string,
        public type: string,
        public logo?: string // ? est mit parceque c'est optionnel
    ){}
}
