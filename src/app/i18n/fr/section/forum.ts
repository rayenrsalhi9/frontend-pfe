export const forum = {
  FORUM: {
    TITLE: "Forum Communautaire",
    DESCRIPTION: "Parcourez, créez et gérez les discussions",

    TABLE: {
      TOPIC: "Sujet",
      CATEGORY: "Catégorie",
      REPLIES: "Réponses",
      REACTIONS: "Réactions",
      ACTIVITY: "Dernière activité",
      CREATED: "Date de création",
      CLOSED: "Fermé",
      CREATOR: "Auteur",
      STATUS: "Statut",
      ACTIONS: "Actions",
      SEARCH_BY_NAME: "Rechercher un sujet...",
      SEARCH_BY_CATEGORY: "Filtrer par catégorie",
      SEARCH_BY_DATE: "Filtrer par date",
    },

    BUTTONS: {
      VIEW: "Voir",
      ADD: "Nouveau sujet",
      EDIT: "Modifier",
      DELETE: "Supprimer",
      COMMENTS: "Commentaires",
    },

    ADD: {
      LABELS: {
        TITLE: "Titre du sujet",
        TAGS: "Tags",
        CATEGORY: "Catégorie",
        CONTENT: "Description",
        PRIVATE: "Sujet privé",
        CLOSED: "Marquer comme fermé",
      },
      BUTTONS: {
        SAVE: "Publier",
        CANCEL: "Annuler",
      },
      ERROR: {
        TITLE: "Veuillez saisir un titre",
        CATEGORY: "Veuillez sélectionner une catégorie",
        CONTENT: "Le contenu ne peut pas être vide",
      },
      TOAST: {
        SAVE_SUCCESSFULLY: "Sujet créé avec succès",
      },
    },

    DELETE_COMMENT: {
      LABEL: {
        TITLE: "Supprimer le commentaire",
        MESSAGE:
          "Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.",
        BUTTON: {
          CANCEL: "Annuler",
          CONFIRM: "Supprimer",
        },
      },
      TOAST: {
        DELETED_SUCCESSFULLY: "Commentaire supprimé avec succès",
        DELETED_ERROR: "Échec de la suppression du commentaire",
      },
    },

    DELETE: {
      LABEL: {
        TITLE: "Supprimer le sujet",
        MESSAGE:
          "Êtes-vous sûr de vouloir supprimer ce sujet ? Cette action est irréversible.",
        BUTTON: {
          CANCEL: "Annuler",
          CONFIRM: "Supprimer",
        },
      },
      ERROR: {},
      TOAST: {
        DELETED_SUCCESSFULLY: "Sujet supprimé avec succès",
        DELETED_ERROR: "Échec de la suppression du sujet",
      },
    },

    COMMENT: {
      TITLE_COMMENT: "Commentaires",
      ADD_COMMENT: "Ajouter un commentaire...",
    },

    STATUS: {
      OPEN: "Ouvert",
      CLOSED: "Fermé",
    },
    MODAL: {
      TITLE: "Commentaires de la discussion",
      FETCHING: "Récupération de la conversation...",
      TOTAL_CONTRIBUTIONS: "Total des contributions",
      ADMIN_ONLY: "Contrôle Super Admin uniquement",
      EMPTY_STATE: "Aucun commentaire n'a encore été partagé ici.",
      TOOLTIP_DELETE: "Supprimer le commentaire",
      BUTTON_DISMISS: "Fermer",
    },

    TOAST: {
      ERROR: "Échec de la récupération des forums",
    },
  },
};
