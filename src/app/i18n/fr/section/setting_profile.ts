export const setting_profile = {
  PROFILE_SETTING: {
    TITLE: "Paramètres du profil",
    DESCRIPTION: "Gérez vos informations personnelles et votre photo de profil",

    LABELS: {
      PERSONAL_INFO: "Informations personnelles",
      FIRST_NAME: "Prénom",
      LAST_NAME: "Nom de famille",
      MOBILE: "Numéro de téléphone",
      EMAIL: "Email",
      CHANGE_PICTURE: "Changer la photo",
    },

    PLACEHOLDERS: {
      FIRST_NAME: "Entrez votre prénom",
      LAST_NAME: "Entrez votre nom de famille",
      MOBILE: "Entrez votre numéro de téléphone",
      EMAIL: "Entrez votre email",
    },

    BUTTONS: {
      SAVE: "Enregistrer",
      CANCEL: "Annuler",
    },

    ERRORS: {
      FIRST_NAME_IS_REQUIRED: "Le prénom est requis",
      LAST_NAME_IS_REQUIRED: "Le nom de famille est requis",
      MOBILE_IS_REQUIRED: "Le numéro de téléphone est requis",
      LOAD_FAILED: "Échec du chargement des données utilisateur",
      UPDATE_FAILED: "Échec de la mise à jour du profil",
      VALIDATION_ERROR:
        "Veuillez remplir correctement tous les champs obligatoires",
      INVALID_IMAGE_TYPE:
        "Veuillez sélectionner une image valide (JPEG, PNG, GIF ou WebP)",
      FILE_TOO_LARGE: "La taille de l'image doit être inférieure à 5 Mo",
      READ_FAILED: "Échec de la lecture du fichier sélectionné",
    },

    TOAST: {
      PROFILE_UPDATED_SUCCESSFULLY: "Profil mis à jour avec succès",
    },

    ACCESSIBILITY: {
      PROFILE_PICTURE: "Photo de profil",
      DEFAULT_AVATAR: "Avatar par défaut",
    },

    PASSWORD: {
      LABELS: {
        TITLE: "Mot de passe Utilisateur",
        EMAIL: "Email",
        PASSWORD: "Mot de passe",
        CONFPASSWORD: "Confirmer le mot de passe",
        CURRENT_PASSWORD: "Mot de passe actuel",
      },
      BUTTONS: {
        SAVE: "Enregistrer",
        CANCEL: "Annuler",
      },
      ERRORS: {
        CURRENT_PASSWORD_IS_REQUIRED: "Le mot de passe actuel est requis",
        PASSWORD_IS_REQUIRED: "Le mot de passe est requis",
        YOU_HAVE_TO_ENTER_AT_LEAST_DIGIT:
          "Vous devez entrer au moins un chiffre",
        CONFIRM_PASSWORD_IS_REQUIRED:
          "La confirmation du mot de passe est requise",
        PASSWORDS_DO_NOT_MATCH: "Les mots de passe ne correspondent pas",
      },
      TOAST: {
        SUCCESSFULLY_CHANGED_PASSWORD:
          "Le mot de passe a été changé avec succès",
      },
    },
  },
};
