export const users = {
  USERS: {
    LIST: {
      TITLE: "Liste des utilisateurs",
      DESCRIPTION:
        "Gérez les comptes d'utilisateurs, les rôles et les autorisations au sein de votre organisation.",
      TABLE: {
        EMAIL: "Adresse e-mail",
        FIRSTNAME: "Prénom",
        LASTNAME: "Nom",
        MOBILE: "Numéro de mobile",
        PHONE: "Numéro de téléphone",
        DIRECTION: "Département",
        ACTION: "Actions",
      },
      BUTTONS: {
        ADD: "Ajouter un utilisateur",
        EDIT: "Modifier",
        DELETE: "Supprimer",
        RESETPASSWORD: "Réinitialiser le mot de passe",
      },
      LABELS: {
        SEARCH: "Rechercher des utilisateurs...",
      },
    },

    ADD: {
      LABELS: {
        FIRSTNAME: "Prénom",
        LASTNAME: "Nom",
        MOBILE: "Numéro de mobile",
        EMAIL: "Adresse e-mail",
        PASSWORD: "Mot de passe",
        CONFPASSWORD: "Confirmer le mot de passe",
        ROLES: "Rôles utilisateur",
        DIRECTION: "Département",
      },

      BUTTONS: {
        ADD: "Enregistrer",
        CANCEL: "Annuler",
      },

      ERRORS: {
        FIRST_NAME_IS_REQUIRED: "Le prénom est obligatoire",
        LAST_NAME_IS_REQUIRED: "Le nom est obligatoire",
        MOBILE_IS_REQUIRED: "Le numéro de mobile est obligatoire",
        EMAIL_IS_REQUIRED: "L'adresse e-mail est obligatoire",
        PLEASE_ENTER_VALID_EMAIL: "Veuillez saisir une adresse e-mail valide",
        PASSWORD_IS_REQUIRED: "Le mot de passe est obligatoire",
        YOU_HAVE_TO_ENTER_AT_LEAST_DIGIT:
          "Le mot de passe doit contenir au moins un chiffre",
        CONFIRM_PASSWORD_IS_REQUIRED: "Veuillez confirmer le mot de passe",
        PASSWORDS_DO_NOT_MATCH: "Les mots de passe ne correspondent pas",
        DIRECTION_IS_REQUIRED: "Le département est obligatoire",
      },

      TOAST: {
        ADDED_SUCCESS: "Utilisateur ajouté avec succès",
        USER_UPDATED_SUCCESSFULLY: "Utilisateur mis à jour avec succès",
        ADDED_ERROR: "Une erreur est survenue lors de l'ajout de l'utilisateur",
        PLEASE_ENTER_PROPER_DATA: "Veuillez saisir des informations valides",
      },
    },

    PASSWORD: {
      LABELS: {
        TITLE: "Mot de passe utilisateur",
        EMAIL: "Adresse e-mail",
        PASSWORD: "Nouveau mot de passe",
        CONFPASSWORD: "Confirmer le mot de passe",
      },

      BUTTONS: {
        SAVE: "Enregistrer",
        CANCEL: "Annuler",
      },

      ERRORS: {
        EMAIL_IS_REQUIRED: "L'adresse e-mail est obligatoire",
        PLEASE_ENTER_VALID_EMAIL: "Veuillez saisir une adresse e-mail valide",
        PASSWORD_IS_REQUIRED: "Le mot de passe est obligatoire",
        YOU_HAVE_TO_ENTER_AT_LEAST_DIGIT:
          "Le mot de passe doit contenir au moins un chiffre",
        CONFIRM_PASSWORD_IS_REQUIRED:
          "La confirmation du mot de passe est obligatoire",
        PASSWORDS_DO_NOT_MATCH: "Les mots de passe ne correspondent pas",
      },

      TOAST: {
        SUCCESSFULLY_CHANGED_PASSWORD: "Mot de passe modifié avec succès",
      },
    },

    DELETE: {
      LABEL: {
        title: "Supprimer l'utilisateur",
        message:
          "Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?",
        button: {
          cancel: "Annuler",
          confirm: "Confirmer",
        },
      },

      ERROR: {},

      TOAST: {
        USER_DELETED_SUCCESSFULLY: "Utilisateur supprimé avec succès",
      },
    },
  },
};
