export const documents = {
  DOCUMENTS: {
    LIST: {
      TITLE: "Documents",
      DESCRIPTION:
        "Gérez, organisez et consultez tous les documents de votre entreprise de manière sécurisée depuis un seul endroit.",
      BUTTONS: {
        ADD: "Ajouter un document",
        VIEW: "Voir",
        EDIT: "Modifier",
        DOWNLOAD: "Télécharger",
        UPLOAD: "Téléverser une nouvelle version",
        HISTORY: "Historique des versions",
        COMMENT: "Commenter",
        REMINDER: "Rappel",
        EMAIL: "Envoyer un e-mail",
        DELETE: "Supprimer",
      },
      TABLE: {
        NAME: "Nom du document",
        CATEGORY: "Catégorie",
        CREATED: "Créé le",
        CREATOR: "Créé par",
        UPDATED: "Mis à jour le",
        ACTIONS: "Actions",
      },
      LABELS: {
        SEARCH: "Rechercher par nom de document",
        TAGS: "Filtrer par tags",
        CATEGORY: "Filtrer par catégorie",
        DATE: "Filtrer par date",
      },
      EMPTY_STATE: {
        TITLE: "Aucun document trouvé",
        DESCRIPTION: "Aucun document ne correspond aux filtres sélectionnés.",
      },
    },

    ASSIGNED: {
      TITLE: "Documents attribués",
      DESCRIPTION:
        "Consultez et gérez les documents partagés avec vous ou attribués à votre rôle.",
      BUTTONS: {
        ADD: "Ajouter un document",
        VIEW: "Voir",
        EDIT: "Modifier",
        DOWNLOAD: "Télécharger",
        UPLOAD: "Téléverser une nouvelle version",
        HISTORY: "Historique des versions",
        COMMENT: "Commenter",
        REMINDER: "Rappel",
        EMAIL: "Envoyer un e-mail",
        DELETE: "Supprimer",
      },
      TABLE: {
        NAME: "Nom du document",
        CATEGORY: "Catégorie",
        CREATED: "Créé le",
        CREATOR: "Créé par",
        UPDATED: "Mis à jour le",
        EXPIRE: "Expire le",
        ACTIONS: "Actions",
      },
      LABELS: {
        SEARCH: "Rechercher par nom de document",
        TAGS: "Filtrer par tags",
        CATEGORY: "Filtrer par catégorie",
        DATE: "Filtrer par date",
      },
      EMPTY_STATE: {
        TITLE: "Aucun document attribué trouvé",
        DESCRIPTION:
          "Aucun document attribué ne correspond aux filtres sélectionnés.",
      },
    },

    ADD: {
      LABEL: {
        DOCUMENT_UPLOAD: "Téléverser un document",
        DOCUMENT_NAME: "Nom du document",
        DOCUMENT_CATEGORY: "Catégorie",
        DOCUMENT_DESCRIPTION: "Description",
        DOCUMENT_TAGS: "Tags",
        DOCUMENT_ROLE_ASSIGN: "Attribuer/Partager avec des rôles",
        DOCUMENT_USER_ASSIGN: "Attribuer/Partager avec des utilisateurs",
        DOCUMENT_PERIODE: "Définir la période",
        DOCUMENT_PERIODE_SD: "Date de début",
        DOCUMENT_PERIODE_ED: "Date de fin",
        DOCUMENT_DOWNLOAD: "Autoriser le téléchargement",
        DOCUMENT_SAVE: "Enregistrer",
        DOCUMENT_CANCEL: "Annuler",
      },
      ERROR: {
        DOCUMENT_IS_REQUIRED: "Le document est requis.",
        DOCUMENT_TYPE_IS_NOT_ALLOW: "Ce type de fichier n’est pas autorisé.",
        NAME_IS_REQUIRED: "Le nom du document est requis.",
        CATEGORY_IS_REQUIRED: "La catégorie est requise.",
        START_DATE_IS_REQURED: "La date de début est requise.",
        END_DATE_IS_REQURED: "La date de fin est requise.",
      },
      TOAST: {
        DOCUMENT_SAVE_SUCCESSFULLY: "Document enregistré avec succès.",
      },
    },

    EDIT: {
      LABEL: {
        DOCUMENT_EDIT: "Modifier le document",
        DOCUMENT_NAME: "Nom du document",
        DOCUMENT_CATEGORY: "Catégorie",
        DOCUMENT_DESCRIPTION: "Description",
        DOCUMENT_TAGS: "Tags",
        DOCUMENT_SAVE: "Enregistrer",
        DOCUMENT_CANCEL: "Annuler",
      },
      ERROR: {
        NAME_IS_REQUIRED: "Le nom du document est requis.",
        CATEGORY_IS_REQUIRED: "La catégorie est requise.",
      },
      TOAST: {
        DOCUMENT_UPDATE_SUCCESSFULLY: "Document mis à jour avec succès.",
      },
    },

    UPLOAD: {
      LABEL: {
        DOCUMENT_NEW_VERSION: "Téléverser une nouvelle version",
        DOCUMENT_UPLOAD: "Téléversement du document",
        DOCUMENT_SAVE: "Enregistrer",
        DOCUMENT_CANCEL: "Annuler",
      },
      ERROR: {
        DOCUMENT_TYPE_IS_NOT_ALLOW: "Ce type de fichier n’est pas autorisé.",
      },
      TOAST: {
        DOCUMENT_SAVE_SUCCESSFULLY: "Document téléversé avec succès.",
      },
    },

    DOWNLOAD: {
      TOAST: {
        ERROR_WHILE_DOWNLOADING_DOCUMENT:
          "Une erreur est survenue lors du téléchargement du document.",
      },
    },

    HISTORY: {
      LABEL: {
        DOCUMENT_VERSION_HISTORY: "Historique des versions",
        DOCUMENT_ADDED_BY: "Ajouté par",
        DOCUMENT_CURRENT_VERSION: "Version actuelle",
        DOCUMENT_VISIBILITY: "Visibilité",
        DOCUMENT_DOWNLOAD: "Télécharger",
        DOCUMENT_RESTORE: "Restaurer",
      },
      ERROR: {},
      TOAST: {
        VERSION_RESTORED_SUCCESSFULLY: "Version restaurée avec succès.",
        ERROR_WHILE_DOWNLOADING_DOCUMENT:
          "Une erreur est survenue lors du téléchargement du document.",
      },
    },

    COMMENT: {
      LABEL: {
        DOCUMENT_COMMENT_TITLE: "Commentaires du document",
        DOCUMENT_COMMENT: "Commentaire",
        DOCUMENT_ADD_COMMENT: "Ajouter un commentaire",
        DOCUMENT_CLOSE: "Fermer",
      },
      ERROR: {
        COMMENT_IS_REQUIRED: "Le commentaire est requis.",
      },
      TOAST: {},
    },

    REMINDER: {
      LABEL: {
        DOCUMENT_REMINDER_TITLE: "Rappel du document",
        DOCUMENT_REMINDER_SUBJECT: "Objet",
        DOCUMENT_REMINDER_MESSAGE: "Message",
        DOCUMENT_REMINDER_REPEAT: "Répéter le rappel",
        DOCUMENT_REMINDER_SEND_EMAIL: "Envoyer un e-mail",
        DOCUMENT_REMINDER_USERS: "Sélectionner des utilisateurs",
        DOCUMENT_REMINDER_FREQUENCY: "Fréquence",
        DOCUMENT_REMINDER_WEEKDAYS: "Jours de la semaine",
        DOCUMENT_REMINDER_DATE: "Date du rappel",
        DOCUMENT_REMINDER_START_DATE: "Date de début",
        DOCUMENT_REMINDER_END_DATE: "Date de fin",
        DOCUMENT_REMINDER_SAVE: "Enregistrer",
        DOCUMENT_REMINDER_CANCEL: "Annuler",
        SELECT_QUARTER_DATE: "Sélectionner la date du trimestre",
        SELECT_REMINDER_MONTH: "Sélectionner le mois du rappel",
        SELECT_REMINDER_DAY: "Sélectionner le jour du rappel",
        SELECT_DATE: "Sélectionner la date",
      },
      ERROR: {
        SUBJECT_IS_REQUIRED: "L’objet est requis.",
        MESSAGE_IS_REQUIRED: "Le message est requis.",
        FREQUENCY_IS_REQUIRED: "La fréquence est requise.",
        PLEASE_SELECT_VALID_DAY: "Veuillez sélectionner un jour valide.",
        DATE_IS_REQUIRED: "La date du rappel est requise.",
        START_DATE_SHOULD_BE_GREATER_THEN_CURRENT_DATE_TIME:
          "La date de début doit être postérieure à la date et l’heure actuelles.",
        START_DATE_IS_REQUIRED: "La date de début est requise.",
      },
      TOAST: {
        REMINDER_CREATED_SUCCESSFULLY: "Rappel créé avec succès.",
        REMINDER_UPDATED_SUCCESSFULLY: "Rappel mis à jour avec succès.",
      },
    },

    EMAIL: {
      LABEL: {
        DOCUMENT_EMAIL_TITLE: "Envoyer un e-mail",
        DOCUMENT_EMAIL_TO: "À",
        DOCUMENT_EMAIL_SUBJECT: "Objet",
        DOCUMENT_EMAIL_BODY: "Message",
        DOCUMENT_EMAIL_ATTACHMENT_DOCUMENT: "Joindre le document",
        DOCUMENT_EMAIL_SEND: "Envoyer",
      },
      ERROR: {
        TO_ADDRESS_IS_REQUIRED: "L’adresse e-mail du destinataire est requise.",
        EMAIL_IS_NOT_PROPER_FORMAT:
          "Veuillez saisir une adresse e-mail valide.",
        SUBJECT_IS_REQUIRED: "L’objet est requis.",
        BODY_IS_REQUIRED: "Le corps du message est requis.",
      },
      TOAST: {
        EMAIL_SENT_SUCCESSFULLY: "E-mail envoyé avec succès.",
      },
    },

    DELETE: {
      LABEL: {
        TITLE: "Êtes-vous sûr ?",
        MESSAGE: "Êtes-vous sûr de vouloir supprimer ce document ?",
        BUTTON: {
          CANCEL: "Annuler",
          CONFIRM: "Confirmer",
        },
      },
      ERROR: {},
      TOAST: {
        DOCUMENT_DELETED_SUCCESSFULLY: "Document supprimé avec succès.",
      },
    },

    SHARE: {
      LABEL: {
        DOCUMENT_SHARE: "Partager le document",
        DOCUMENT_NAME: "Nom du document",
        DESCRIPTION: "Description",
      },
      ERROR: {},
      TOAST: {
        PERMISSION_DELETED_SUCCESSFULLY: "Autorisation supprimée avec succès.",
      },
    },
  },
};
