
export const MENU_ITEMS = [
  {
    title: 'Accueil',
    icon: 'home-outline',
    link: '/pages/accueil',
  },
  {
    title: 'Administration',
    icon: 'keypad-outline',
    children: [
      {
        title: 'Structures',
        link: '/pages/structure',
      },
      {
        title: 'Année',
        link: '/pages/annee',
      },
      {
        title: 'Evènement',
        link: '/pages/evements',
      },
      {
        title: 'Filières & options',
        link: '/pages/filieres_options',
      },

      {
        title: "Frais d'inscription",
        link: '/pages/frais_inscription',
      },
      {
        title: "Frais de scolarité",
        link: '/pages/frais_scolarite',
      },
      {
        title: "Specialité - fonction",
        link: '/pages/specialite_fonction',
      },
    ],
  },
  /*{
    title: 'Gestion de Frais',
    icon: 'credit-card-outline',
    children: [
      {
        title: 'Liste des Frais',
        link: '/pages/gestionfrais', //le lien doit amener vers la liste des frais d'inscription
      },
      {
        title: 'Frais d\'inscription',
        link: '/pages/gestionfrais/inscription', //le lien doit amener vers le formulaire d'ajout de frais d'inscription
      },
      {
        title: 'Frais de scolarité',
        link: '/pages/gestionfrais/scolarite', // le lien doit amener vers le formulaire d'ajout de frais de scolarité
      },
    ],
  },*/
  {
    title: 'Gestion de pré-insription',
    icon: 'keypad-outline',
    children: [
      {
        title: 'Candidat',
        link: '/pages/candidat'
      },
    ],
  },
];
