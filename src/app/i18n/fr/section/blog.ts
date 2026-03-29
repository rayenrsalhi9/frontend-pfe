export const blog = {
  BLOG: {
    LIST: {
      TITLE: "Articles de blog",
      DESCRIPTION: "Gérez vos articles de blog ici.",
    },
    TABLE: {
      PICTURE: "Image",
      TITLE: "Titre",
      CATEGORY: "Catégorie",
      CREATED: "Créé le",
      CREATOR: "Créateur",
      PRIVACY: "Confidentialité",
      ACTIONS: "Actions",
      BANNER: "Bannière",
      SEARCH_BY_NAME: "Rechercher par nom",
      SEARCH_BY_CATEGORY: "Rechercher par catégorie",
      SEARCH_BY_DATE: "Rechercher par date",
      LOAD_ERROR: "Impossible de charger les articles. Veuillez réessayer.",
    },
    PRIVACY: {
      PUBLIC: "Public",
      PRIVATE: "Privé",
    },
    BANNER: {
      YES: "Oui",
      NO: "Non",
    },
    BUTTONS: {
      VIEW: "Voir",
      ADD: "Ajouter un article",
      EDIT: "Modifier",
      DELETE: "Supprimer",
    },
    ADD: {
      LABELS: {
        PICTURE: "Image",
        TITLE: "Titre",
        TAGS: "Étiquettes",
        CATEGORY: "Catégorie",
        SUBTITLE: "Sous-titre",
        AUDIENCE: "Audience",
        EXPIRATION: "Expiration",
        STARTDATE: "Date de début",
        ENDDATE: "Date de fin",
        BODY: "Contenu",
        BANNER: "Bannière",
      },
      BUTTONS: {
        SAVE: "Enregistrer",
        CANCEL: "Annuler",
        CHANGE: "Modifier",
      },
      ERROR: {
        PICTURE: "Une image est requise.",
        TITLE: "Un titre est requis.",
        SUBTITLE: "Un sous-titre est requis.",
        CATEGORY: "Une catégorie est requise.",
        BODY: "Le contenu est requis.",
      },
      ERRORS: {
        ID_MISSING: "L'identifiant du blog est manquant.",
      },
      TOAST: {
        SAVE_SUCCESSFULLY: "Article enregistré avec succès.",
      },
    },
    DELETE: {
      LABEL: {
        TITLE: "Supprimer l'article",
        MESSAGE: "Êtes-vous sûr de vouloir supprimer cet article ?",
        BUTTON: {
          CANCEL: "Annuler",
          CONFIRM: "Confirmer",
        },
      },
      ERROR: {},
      TOAST: {
        DELETED_SUCCESSFULLY: "Article supprimé avec succès.",
      },
    },

    DELETE_COMMENT: {
      TITLE:
        "Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.",
      BUTTON: {
        CANCEL: "Annuler",
        CONFIRM: "Supprimer",
      },
      TOAST: {
        DELETED_SUCCESSFULLY: "Commentaire supprimé avec succès",
        DELETED_ERROR: "Échec de la suppression du commentaire",
      },
    },

    MODAL: {
      TITLE: "Commentaires du Blog",
      FETCHING: "Récupération de la conversation...",
      TOTAL_CONTRIBUTIONS: "Total des contributions",
      ADMIN_ONLY: "Contrôle Super Admin uniquement",
      EMPTY_STATE: "Aucun commentaire n'a encore été partagé ici.",
      TOOLTIP_DELETE: "Supprimer le commentaire",
      BUTTON_DISMISS: "Fermer",
    },
  },
};
