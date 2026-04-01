export const add = {
  ADD: {
    FORUM: {
      TITLE: "Nouveau fil de discussion",
      DESCRIPTION:
        "Lancez une discussion, posez une question ou partagez quelque chose avec la communauté.",
      LABELS: {
        TITLE: "Titre",
        CATEGORY: "Catégorie",
        SUBCATEGORY: "Sous-catégorie",
        TAGS: "Étiquettes",
        CONTENT: "Contenu",
        PRIVATE: "Fil de discussion privé",
      },
      PLACEHOLDERS: {
        TITLE: "De quoi parle votre fil ?",
        TAGS: "Ajoutez une étiquette et appuyez sur Entrée…",
        CONTENT: "Écrivez le contenu de votre fil ici…",
      },
      HINTS: {
        TAGS: "Appuyez sur Entrée après chaque étiquette. Les étiquettes aident les autres à trouver votre fil.",
        PRIVATE:
          "Seuls les membres que vous invitez pourront voir et répondre à ce fil.",
        REQUIRED_FIELDS: "Les champs marqués * sont obligatoires",
      },
      BUTTONS: {
        SAVE: "Publier le fil",
        CANCEL: "Annuler",
      },
      ERRORS: {
        TITLE_REQUIRED: "Le titre est obligatoire",
        CATEGORY_REQUIRED: "La catégorie est obligatoire",
        CONTENT_REQUIRED: "Le contenu est obligatoire",
        TAGS_INVALID: "Format d'étiquette invalide",
        SAVE_FAILED: "Échec de la publication du fil",
      },
      TOAST: {
        SUCCESS: "Fil publié avec succès",
        ERROR: "Échec de la publication du fil",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "Le titre doit contenir au moins 5 caractères",
        TITLE_MAX_LENGTH: "Le titre ne peut pas dépasser 200 caractères",
        CONTENT_MIN_LENGTH: "Le contenu doit contenir au moins 10 caractères",
      },
    },

    BLOG: {
      TITLE: "Nouvel article de blog",
      DESCRIPTION: "Rédigez et publiez un article pour votre audience.",
      LABELS: {
        PICTURE: "Image de couverture",
        TITLE: "Titre",
        SUBTITLE: "Sous-titre",
        CATEGORY: "Catégorie",
        TAGS: "Étiquettes",
        BODY: "Contenu",
        EXPIRATION: "Définir l'expiration",
        STARTDATE: "Date de début",
        ENDDATE: "Date de fin",
        BANNER: "Afficher en bannière",
        PRIVATE: "Article privé",
      },
      PLACEHOLDERS: {
        PICTURE: "Télécharger une image de couverture",
        TITLE: "Donnez un titre à votre article…",
        SUBTITLE: "Une courte description affichée dans les aperçus…",
        TAGS: "Ajoutez une étiquette et appuyez sur Entrée…",
        BODY: "Rédigez le contenu de votre article ici…",
      },
      HINTS: {
        EXPIRATION:
          "Définissez une période pendant laquelle cet article sera visible.",
        BANNER:
          "Affichez cet article comme bannière en vedette sur la page d'accueil.",
        PRIVATE: "Seuls vous et les membres invités pourront voir cet article.",
        REQUIRED_FIELDS: "Les champs marqués * sont obligatoires",
      },
      BUTTONS: {
        SAVE: "Publier l'article",
        CANCEL: "Annuler",
        CHANGE_IMAGE: "Changer l'image",
        UPLOAD_IMAGE: "Télécharger une image",
      },
      ERRORS: {
        PICTURE_REQUIRED: "L'image de couverture est obligatoire",
        TITLE_REQUIRED: "Le titre est obligatoire",
        SUBTITLE_REQUIRED: "Le sous-titre est obligatoire",
        CATEGORY_REQUIRED: "La catégorie est obligatoire",
        BODY_REQUIRED: "Le contenu est obligatoire",
        DATE_INVALID: "Plage de dates invalide",
        IMAGE_INVALID: "Format d'image invalide",
        SAVE_FAILED: "Échec de la publication de l'article",
      },
      TOAST: {
        SUCCESS: "Article de blog publié avec succès",
        ERROR: "Échec de la publication de l'article de blog",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "Le titre doit contenir au moins 5 caractères",
        TITLE_MAX_LENGTH: "Le titre ne peut pas dépasser 200 caractères",
        SUBTITLE_MIN_LENGTH:
          "Le sous-titre doit contenir au moins 10 caractères",
        SUBTITLE_MAX_LENGTH:
          "Le sous-titre ne peut pas dépasser 300 caractères",
        BODY_MIN_LENGTH: "Le contenu doit contenir au moins 50 caractères",
        IMAGE_TOO_LARGE: "La taille de l'image doit être inférieure à 5 Mo",
      },
    },

    ARTICLE: {
      TITLE: "Nouvel article",
      DESCRIPTION:
        "Créez un article d'actualité ou une annonce pour votre communauté.",
      LABELS: {
        PICTURE: "Image de couverture",
        TITLE: "Titre",
        CATEGORY: "Catégorie",
        DESCRIPTION: "Courte description",
        BODY: "Contenu",
        USERS: "Utilisateurs autorisés",
        PRIVATE: "Article privé",
      },
      PLACEHOLDERS: {
        PICTURE: "Télécharger une image de couverture",
        TITLE: "Donnez un titre à votre article…",
        DESCRIPTION: "Rédigez un court résumé affiché dans les aperçus…",
        BODY: "Rédigez le contenu de votre article ici…",
        USERS: "Rechercher des utilisateurs…",
      },
      HINTS: {
        PRIVATE:
          "Seuls vous et les utilisateurs que vous sélectionnez pourront voir cet article.",
        USERS:
          "Laissez vide pour permettre à tous les membres invités de lire cet article.",
        REQUIRED_FIELDS: "Les champs marqués * sont obligatoires",
      },
      BUTTONS: {
        SAVE: "Publier l'article",
        CANCEL: "Annuler",
        CHANGE_IMAGE: "Changer l'image",
        UPLOAD_IMAGE: "Télécharger une image",
      },
      ERRORS: {
        PICTURE_REQUIRED: "L'image de couverture est obligatoire",
        TITLE_REQUIRED: "Le titre est obligatoire",
        CATEGORY_REQUIRED: "La catégorie est obligatoire",
        DESCRIPTION_REQUIRED: "La courte description est obligatoire",
        BODY_REQUIRED: "Le contenu est obligatoire",
        IMAGE_INVALID: "Format d'image invalide",
        SAVE_FAILED: "Échec de la publication de l'article",
      },
      TOAST: {
        SUCCESS: "Article publié avec succès",
        ERROR: "Échec de la publication de l'article",
        UPDATED_SUCCESSFULLY: "Article mis à jour avec succès",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "Le titre doit contenir au moins 5 caractères",
        TITLE_MAX_LENGTH: "Le titre ne peut pas dépasser 200 caractères",
        DESCRIPTION_MIN_LENGTH:
          "La description doit contenir au moins 20 caractères",
        DESCRIPTION_MAX_LENGTH:
          "La description ne peut pas dépasser 500 caractères",
        BODY_MIN_LENGTH: "Le contenu doit contenir au moins 50 caractères",
        IMAGE_TOO_LARGE: "La taille de l'image doit être inférieure à 5 Mo",
      },
    },

    SHARED: {
      LABELS: {
        LOADING: "Chargement…",
        REQUIRED: "Champ obligatoire",
        OPTIONAL: "Facultatif",
        SELECT_PLACEHOLDER: "Sélectionnez une option",
        MULTI_SELECT_PLACEHOLDER: "Sélectionnez plusieurs options",
        TAG_PLACEHOLDER: "Ajouter des étiquettes…",
        SEARCH_USERS: "Rechercher des utilisateurs…",
        NO_OPTIONS: "Aucune option disponible",
        NO_RESULTS: "Aucun résultat trouvé",
        BASIC_INFO: "Informations de base",
        SETTINGS: "Paramètres",
      },
      BUTTONS: {
        BROWSE: "Parcourir",
        UPLOAD: "Télécharger",
        REMOVE: "Supprimer",
        CLEAR: "Effacer",
        RESET: "Réinitialiser",
        CLOSE: "Fermer",
      },
      ERRORS: {
        NETWORK_ERROR: "Erreur réseau. Veuillez réessayer",
        VALIDATION_ERROR: "Veuillez corriger les erreurs ci-dessus",
        UNAUTHORIZED: "Vous n'avez pas la permission d'effectuer cette action",
        UNKNOWN_ERROR: "Une erreur inattendue s'est produite",
      },
      VALIDATION: {
        MIN_LENGTH: "Doit contenir au moins {{min}} caractères",
        MAX_LENGTH: "Ne peut pas dépasser {{max}} caractères",
        PATTERN_INVALID: "Format invalide",
        EMAIL_INVALID: "Adresse e-mail invalide",
        URL_INVALID: "Format d'URL invalide",
        DATE_INVALID: "Format de date invalide",
      },
    },
  },

  EDIT: {
    FORUM: {
      TITLE: "Modifier le fil de discussion",
      DESCRIPTION: "Mettez à jour votre fil de discussion et ses paramètres.",
    },
    BLOG: {
      TITLE: "Modifier l'article de blog",
      DESCRIPTION: "Mettez à jour votre article de blog et ses paramètres.",
    },
    ARTICLE: {
      TITLE: "Modifier l'article",
      DESCRIPTION: "Mettez à jour votre article et ses paramètres.",
      BUTTONS: {
        UPDATE: "Mettre à jour l'article",
      },
    },
  },
};
