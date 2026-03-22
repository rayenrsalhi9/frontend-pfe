export const roles = {
  ROLES: {
    LIST: {
      TITLE: "Rôles",
      DESCRIPTION:
        "Définissez et gérez les niveaux d’accès et les autorisations fonctionnelles de vos utilisateurs.",
      TABLE: {
        NAME: "Nom du rôle",
        CREATED: "Créé le",
        UPDATED: "Mis à jour le",
        ACTIONS: "Actions",
      },
      BUTTONS: {
        ADD: "Ajouter un rôle",
        EDIT: "Modifier",
        DELETE: "Supprimer",
      },
      EMPTY_STATE: {
        TITLE: "Aucun rôle trouvé",
        DESCRIPTION: "Aucun rôle n’est disponible pour le moment.",
      },
      LABELS: {
        SEARCH: "Rechercher des rôles...",
      },
    },

    ADD: {
      LABELS: {
        NAME: "Nom du rôle",
        PERMISSIONS: "Autorisations",
        SELECTALL: "Tout sélectionner",
      },
      BUTTONS: {
        ADD: "Enregistrer",
        UPDATE: "Mettre à jour",
        CANCEL: "Annuler",
      },
      ERRORS: {
        PLEASE_ENTER_ROLE_NAME: "Veuillez saisir un nom de rôle.",
        PLEASE_SELECT_AT_LEAST_ONE_PERMISSION:
          "Veuillez sélectionner au moins une autorisation.",
      },
      TOAST: {
        ROLE_SAVED_SUCCESSFULLY: "Rôle enregistré avec succès.",
        ROLE_UPDATED_SUCCESSFULLY: "Rôle mis à jour avec succès.",
      },
    },

    DELETE: {
      LABEL: {
        TITLE: "Supprimer le rôle",
        MESSAGE: "Êtes-vous sûr de vouloir supprimer ce rôle ?",
        BUTTON: {
          CANCEL: "Annuler",
          CONFIRM: "Confirmer",
        },
      },
      ERROR: {},
    },

    TOAST: {
      ROLE_DELETED_SUCCESSFULLY: "Rôle supprimé avec succès.",
    },
  },
};
