import { ResumeData } from './types';

export const initialResumeData: ResumeData = {
  contact: {
    name: "Arnaldo KOUTOMI",
    title: "Conseiller Client & Assistant Administratif",
    phone: "(229) 01 67 43 09 10",
    email: "alkoutomi@gmail.com",
    location: "Cotonou, Bénin",
    photoUrl: "" // Will be handled dynamically or let user upload
  },
  summary: "Professionnel de l'accueil doté d'un excellent sens du service et d'une grande capacité d'écoute, je possède une solide expérience en relation client et en communication. Organisé, empathique et réactif, je suis pleinement en mesure d'assurer un accueil de qualité et une orientation efficace de l'ensemble des usagers dans un environnement hospitalier.",
  experiences: [
    {
      id: "exp-1",
      role: "Conseiller client CONCENTRIX",
      company: "CONCENTRIX BENIN",
      location: "Cotonou, Bénin",
      period: "Août 2024 - Juillet 2026",
      highlights: [
        "Gestion multicanale: assistance et traitement efficace des demandes clients via appels, mails et chats",
        "Fidélisation clients: résolution proactive des problèmes améliorant la satisfaction et la rétention",
        "Gestion des réclamations: traitement des objections avec professionnalisme contribuant à l'amélioration continue des processus"
      ]
    },
    {
      id: "exp-2",
      role: "MANAGER ENTREPRISE DE LIVRAISON",
      company: "GOLIVRAISON",
      location: "Cotonou, Bénin",
      period: "2020 - 2024",
      highlights: [
        "Gestion des appels entrants et sortants avec les clients et les coursiers",
        "Gestion des plaintes et des retards de livraison",
        "Supervision des opérations logistiques: planification et optimisation des tournées de livraison, coordination des coursiers pour assurer le respect des délais"
      ]
    },
    {
      id: "exp-3",
      role: "SECRETARIAT GENERAL",
      company: "ONG WOLSI BENIN (LEADERSHIP ET ENTREPRENEURIAT FÉMININ)",
      location: "Porto-Novo, Bénin",
      period: "2018 - 2020",
      highlights: [
        "Réception et orientation des appels: accueillir les appels entrants, identifier les besoins et diriger vers les services appropriés",
        "Gestion des appels sortants: contacter les partenaires pour transmettre des informations, planifier des réunions",
        "Coordination des activités de l'ONG"
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Certificat sur l'égalité femmes-hommes",
      institution: "Organisation Internationale de la Francophonie",
      period: "Octobre-Novembre 2025"
    },
    {
      id: "edu-2",
      degree: "Brevet d'Aptitude au Professorat (BAPES)",
      institution: "Ecole Normale Supérieure de Porto-Novo",
      period: "2017"
    },
    {
      id: "edu-3",
      degree: "Baccalauréat A2",
      institution: "CEG Suru-Léré",
      period: "2014"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "Assistant administratif",
      issuer: "Microsoft / LinkedIn Learning",
      date: "Juillet 2026"
    },
    {
      id: "cert-2",
      title: "Spécialiste du service client",
      issuer: "Microsoft / LinkedIn Learning",
      date: "Mai 2026"
    },
    {
      id: "cert-3",
      title: "Les fondements de la communication",
      issuer: "Microsoft / LinkedIn Learning",
      date: "Avril 2026"
    }
  ],
  skills: {
    itTools: [
      "Microsoft Word",
      "Microsoft Excel"
    ],
    expertise: [
      "Secrétariat & Accueil",
      "Communication multicanale",
      "Travail en équipe",
      "Communication professionnelle et écoute active",
      "Accueil et prise en charge des usagers en environnement exigeant"
    ]
  },
  languages: [
    {
      id: "lang-1",
      name: "Français",
      level: "Excellent"
    },
    {
      id: "lang-2",
      name: "Anglais",
      level: "Niveau élémentaire"
    }
  ],
  interests: [
    "Lecture",
    "Engagement associatif",
    "Relations humaines",
    "Randonnée pédestre",
    "Massage relaxant et bien-être",
    "Apprentissage en ligne et perfectionnement professionnel"
  ],
  references: [
    {
      id: "ref-1",
      name: "M. Oladé COBO",
      role: "Manager Projet",
      company: "CONCENTRIX BENIN",
      phone: "(229) 01 97 85 56 57"
    },
    {
      id: "ref-2",
      name: "Mme Bella ZEVOUNOU",
      role: "Présidente",
      company: "ONG WOLSI BENIN",
      phone: "(229) 01 97 01 84 68"
    }
  ],
  signature: {
    text: "Je certifie avec honneur l'exactitude des renseignements ci-dessus mentionnés.",
    location: "COTONOU",
    date: "LE 5 JUILLET 2026"
  }
};
