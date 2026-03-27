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
      TITLE_ADD: "Créer un rôle",
      TITLE_EDIT: "Modifier le rôle",
      DESCRIPTION: "Configurez les détails du rôle et attribuez des autorisations pour contrôler l'accès.",
      LOADING: "Chargement des autorisations...",
      LABELS: {
        NAME: "Nom du rôle",
        NAME_PLACEHOLDER: "ex. Éditeur de contenu",
        PERMISSIONS: "Autorisations",
        PERMISSIONS_DESC: "Sélectionnez les autorisations auxquelles ce rôle doit avoir accès.",
        SELECTALL: "Tout sélectionner",
        ROLE_INFO: "Détails du rôle",
        ROLE_INFO_DESC: "Donnez à ce rôle un nom clair et descriptif.",
      },
      BUTTONS: {
        ADD: "Enregistrer le rôle",
        UPDATE: "Mettre à jour le rôle",
        CANCEL: "Annuler",
        BACK: "Retour aux rôles",
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
