export const add = {
  ADD: {
    FORUM: {
      TITLE: "Nouveau sujet de forum",
      DESCRIPTION:
        "Démarrez une discussion, posez une question ou partagez quelque chose avec la communauté.",
      LABELS: {
        TITLE: "Titre",
        CATEGORY: "Catégorie",
        SUBCATEGORY: "Sous-catégorie",
        TAGS: "Tags",
        CONTENT: "Contenu",
        PRIVATE: "Sujet privé",
      },
      PLACEHOLDERS: {
        TITLE: "De quoi parle votre sujet ?",
        TAGS: "Ajoutez un tag puis appuyez sur Entrée…",
        CONTENT: "Rédigez le contenu de votre sujet ici…",
      },
      HINTS: {
        TAGS: "Appuyez sur Entrée après chaque tag. Les tags aident les autres à trouver votre sujet.",
        PRIVATE:
          "Seuls les membres que vous invitez pourront voir et répondre à ce sujet.",
        REQUIRED_FIELDS: "Les champs marqués * sont obligatoires",
      },
      BUTTONS: {
        SAVE: "Publier le sujet",
        CANCEL: "Annuler",
      },
      ERRORS: {
        TITLE_REQUIRED: "Le titre est requis",
        CATEGORY_REQUIRED: "La catégorie est requise",
        CONTENT_REQUIRED: "Le contenu est requis",
        TAGS_INVALID: "Format de tag invalide",
        SAVE_FAILED: "Échec de la publication du sujet",
      },
      TOAST: {
        SUCCESS: "Sujet publié avec succès",
        ERROR: "Échec de la publication du sujet",
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
        TAGS: "Tags",
        BODY: "Contenu",
        EXPIRATION: "Définir une expiration",
        STARTDATE: "Date de début",
        ENDDATE: "Date de fin",
        BANNER: "Afficher en bannière",
        PRIVATE: "Article privé",
        USERS: "Utilisateurs autorisés",
      },
      PLACEHOLDERS: {
        PICTURE: "Téléverser une image de couverture",
        TITLE: "Donnez un titre à votre article…",
        SUBTITLE: "Une courte description affichée en aperçu…",
        TAGS: "Ajoutez un tag puis appuyez sur Entrée…",
        BODY: "Rédigez le contenu de votre article ici…",
        USERS: "Rechercher des utilisateurs…",
      },
      HINTS: {
        EXPIRATION:
          "Définissez une période pendant laquelle cet article sera visible.",
        BANNER: "Afficher cet article comme bannière sur la page d’accueil.",
        PRIVATE: "Seuls vous et les membres invités pourront voir cet article.",
        REQUIRED_FIELDS: "Les champs marqués * sont obligatoires",
        USERS:
          "Laissez vide pour autoriser tous les membres invités à lire cet article.",
      },
      BUTTONS: {
        SAVE: "Publier l’article",
        CANCEL: "Annuler",
        CHANGE_IMAGE: "Changer l’image",
        UPLOAD_IMAGE: "Téléverser une image",
      },
      ERRORS: {
        PICTURE_REQUIRED: "L’image de couverture est requise",
        TITLE_REQUIRED: "Le titre est requis",
        SUBTITLE_REQUIRED: "Le sous-titre est requis",
        CATEGORY_REQUIRED: "La catégorie est requise",
        BODY_REQUIRED: "Le contenu est requis",
        DATE_INVALID: "Plage de dates invalide",
        IMAGE_INVALID: "Format d’image invalide",
        SAVE_FAILED: "Échec de la publication de l’article",
      },
      TOAST: {
        SUCCESS: "Article publié avec succès",
        ERROR: "Échec de la publication de l’article",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "Le titre doit contenir au moins 5 caractères",
        TITLE_MAX_LENGTH: "Le titre ne peut pas dépasser 200 caractères",
        SUBTITLE_MIN_LENGTH:
          "Le sous-titre doit contenir au moins 10 caractères",
        SUBTITLE_MAX_LENGTH:
          "Le sous-titre ne peut pas dépasser 300 caractères",
        BODY_MIN_LENGTH: "Le contenu doit contenir au moins 50 caractères",
        IMAGE_TOO_LARGE: "La taille de l’image doit être inférieure à 5 Mo",
      },
    },

    ARTICLE: {
      TITLE: "Nouvel article",
      DESCRIPTION: "Créez une actualité ou une annonce pour votre communauté.",
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
        PICTURE: "Téléverser une image de couverture",
        TITLE: "Donnez un titre à votre article…",
        DESCRIPTION: "Rédigez un résumé affiché en aperçu…",
        BODY: "Rédigez le contenu de votre article ici…",
        USERS: "Rechercher des utilisateurs…",
      },
      HINTS: {
        PRIVATE:
          "Seuls vous et les utilisateurs sélectionnés pourront voir cet article.",
        USERS:
          "Laissez vide pour autoriser tous les membres invités à lire cet article.",
        REQUIRED_FIELDS: "Les champs marqués * sont obligatoires",
      },
      BUTTONS: {
        SAVE: "Publier l’article",
        CANCEL: "Annuler",
        CHANGE_IMAGE: "Changer l’image",
        UPLOAD_IMAGE: "Téléverser une image",
      },
      ERRORS: {
        PICTURE_REQUIRED: "L’image de couverture est requise",
        TITLE_REQUIRED: "Le titre est requis",
        CATEGORY_REQUIRED: "La catégorie est requise",
        DESCRIPTION_REQUIRED: "La description est requise",
        BODY_REQUIRED: "Le contenu est requis",
        IMAGE_INVALID: "Format d’image invalide",
        SAVE_FAILED: "Échec de la publication de l’article",
      },
      TOAST: {
        SUCCESS: "Article publié avec succès",
        ERROR: "Échec de la publication de l’article",
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
        IMAGE_TOO_LARGE: "La taille de l’image doit être inférieure à 5 Mo",
      },
    },

    SURVEY: {
      TITLE: "Nouveau sondage",
      DESCRIPTION: "Créez un sondage pour recueillir des avis ou des opinions.",
      LABELS: {
        TITLE: "Titre",
        TYPE: "Type",
        PRIVATE: "Sondage privé",
        USERS: "Utilisateurs autorisés",
      },
      PLACEHOLDERS: {
        TITLE: "De quoi parle ce sondage ?",
        USERS: "Rechercher des utilisateurs…",
      },
      HINTS: {
        PRIVATE:
          "Seuls les membres invités pourront voir et répondre à ce sondage.",
        REQUIRED_FIELDS: "Les champs marqués * sont obligatoires",
      },
      BUTTONS: {
        SAVE: "Créer le sondage",
        CANCEL: "Annuler",
      },
      ERRORS: {
        TITLE_REQUIRED: "Le titre est requis",
        TYPE_REQUIRED: "Le type de sondage est requis",
        SAVE_FAILED: "Échec de la création du sondage",
      },
      TOAST: {
        SUCCESS: "Sondage créé avec succès",
        ERROR: "Échec de la création du sondage",
      },
    },

    CATEGORY: {
      TITLE: "Nouvelle catégorie",
      DESCRIPTION: "Créez une nouvelle catégorie pour organiser votre contenu.",
      LABELS: {
        NAME: "Nom de la catégorie",
        DESCRIPTION: "Description",
      },
      PLACEHOLDERS: {
        NAME: "Entrez le nom de la catégorie…",
        DESCRIPTION: "Décrivez cette catégorie…",
      },
      BUTTONS: {
        SAVE: "Enregistrer la catégorie",
        CANCEL: "Annuler",
      },
      ERRORS: {
        NAME_REQUIRED: "Le nom de la catégorie est requis",
        SAVE_FAILED: "Échec de l'enregistrement de la catégorie",
      },
      TOAST: {
        SUCCESS: "Catégorie enregistrée avec succès",
        ERROR: "Échec de l'enregistrement de la catégorie",
      },
    },

    USER: {
      TITLE: "Nouvel utilisateur",
      DESCRIPTION: "Créez un nouveau compte utilisateur et attribuez des rôles.",
      LABELS: {
        DIRECTION: "Direction",
        FIRSTNAME: "Prénom",
        LASTNAME: "Nom",
        MOBILE: "Mobile",
        EMAIL: "Email",
        PASSWORD: "Mot de passe",
        CONFIRM_PASSWORD: "Confirmer le mot de passe",
        ROLES: "Rôles",
      },
      PLACEHOLDERS: {
        DIRECTION: "Entrez la direction…",
        FIRSTNAME: "Entrez le prénom…",
        LASTNAME: "Entrez le nom…",
        MOBILE: "Entrez le numéro de mobile…",
        EMAIL: "Entrez l'adresse email…",
        PASSWORD: "Entrez le mot de passe…",
        CONFIRM_PASSWORD: "Confirmez le mot de passe…",
        ROLES: "Sélectionnez les rôles…",
      },
      HINTS: {
        REQUIRED_FIELDS: "Les champs marqués * sont obligatoires",
        PASSWORD_MIN_LENGTH: "Le mot de passe doit contenir au moins 6 caractères",
      },
      BUTTONS: {
        SAVE: "Créer l'utilisateur",
        CANCEL: "Annuler",
      },
      ERRORS: {
        DIRECTION_REQUIRED: "La direction est requise",
        FIRST_NAME_REQUIRED: "Le prénom est requis",
        LAST_NAME_REQUIRED: "Le nom est requis",
        MOBILE_REQUIRED: "Le mobile est requis",
        EMAIL_REQUIRED: "L'email est requis",
        EMAIL_INVALID: "Veuillez entrer une adresse email valide",
        PASSWORD_REQUIRED: "Le mot de passe est requis",
        PASSWORD_MIN_LENGTH: "Le mot de passe doit contenir au moins 6 caractères",
        CONFIRM_PASSWORD_REQUIRED: "La confirmation du mot de passe est requise",
        PASSWORDS_DO_NOT_MATCH: "Les mots de passe ne correspondent pas",
        ROLES_REQUIRED: "Au moins un rôle est requis",
        SAVE_FAILED: "Échec de la création de l'utilisateur",
      },
      TOAST: {
        SUCCESS: "Utilisateur créé avec succès",
        ERROR: "Échec de la création de l'utilisateur",
      },
      VALIDATION: {
        PASSWORD_MIN_LENGTH: "Le mot de passe doit contenir au moins 6 caractères",
      },
    },

    SHARED: {
      LABELS: {
        LOADING: "Chargement…",
        REQUIRED: "Champ obligatoire",
        OPTIONAL: "Optionnel",
        SELECT_PLACEHOLDER: "Sélectionnez une option",
        MULTI_SELECT_PLACEHOLDER: "Sélectionnez plusieurs options",
        TAG_PLACEHOLDER: "Ajouter des tags…",
        SEARCH_USERS: "Rechercher des utilisateurs…",
        NO_OPTIONS: "Aucune option disponible",
        NO_RESULTS: "Aucun résultat trouvé",
        BASIC_INFO: "Informations de base",
        SETTINGS: "Paramètres",
      },
      BUTTONS: {
        BROWSE: "Parcourir",
        UPLOAD: "Téléverser",
        REMOVE: "Supprimer",
        CLEAR: "Effacer",
        RESET: "Réinitialiser",
        CLOSE: "Fermer",
      },
      ERRORS: {
        NETWORK_ERROR: "Erreur réseau. Veuillez réessayer",
        VALIDATION_ERROR: "Veuillez corriger les erreurs ci-dessus",
        UNAUTHORIZED: "Vous n’avez pas la permission d’effectuer cette action",
        UNKNOWN_ERROR: "Une erreur inattendue s’est produite",
      },
      VALIDATION: {
        MIN_LENGTH: "Doit contenir au moins {{min}} caractères",
        MAX_LENGTH: "Ne peut pas dépasser {{max}} caractères",
        PATTERN_INVALID: "Format invalide",
        EMAIL_INVALID: "Adresse e-mail invalide",
        URL_INVALID: "Format d’URL invalide",
        DATE_INVALID: "Format de date invalide",
      },
    },
  },

  EDIT: {
    FORUM: {
      TITLE: "Modifier le sujet",
      DESCRIPTION: "Mettez à jour votre sujet et ses paramètres.",
      BUTTONS: {
        SAVE: "Mettre à jour",
      },
      TOAST: {
        SUCCESS: "Sujet mis à jour avec succès",
        ERROR: "Échec de la mise à jour du sujet",
      },
    },
    BLOG: {
      TITLE: "Modifier l’article",
      DESCRIPTION: "Mettez à jour votre article et ses paramètres.",
      BUTTONS: {
        SAVE: "Mettre à jour",
      },
      TOAST: {
        SUCCESS: "Blog mis à jour avec succès",
        ERROR: "Échec de la mise à jour du blog",
      },
    },
    ARTICLE: {
      TITLE: "Modifier l’article",
      DESCRIPTION: "Mettez à jour votre article et ses paramètres.",
      BUTTONS: {
        UPDATE: "Mettre à jour",
        SAVE: "Mettre à jour",
      },
      TOAST: {
        SUCCESS: "Article mis à jour avec succès",
        ERROR: "Échec de la mise à jour de l’article",
      },
    },

    SURVEY: {
      TITLE: "Modifier le sondage",
      DESCRIPTION:
        "Mettez à jour vos paramètres de sondage et vos participants.",
      BUTTONS: {
        SAVE: "Mettre à jour",
      },
      TOAST: {
        SUCCESS: "Sondage mis à jour avec succès",
        ERROR: "Échec de la mise à jour du sondage",
      },
    },

    CATEGORY: {
      TITLE: "Modifier la catégorie",
      DESCRIPTION: "Mettez à jour le nom et la description de votre catégorie.",
      BUTTONS: {
        SAVE: "Mettre à jour",
      },
      TOAST: {
        SUCCESS: "Catégorie mise à jour avec succès",
        ERROR: "Échec de la mise à jour de la catégorie",
      },
    },

    USER: {
      TITLE: "Modifier l'utilisateur",
      DESCRIPTION: "Mettez à jour les informations et les rôles de l'utilisateur.",
      BUTTONS: {
        SAVE: "Mettre à jour",
      },
      TOAST: {
        SUCCESS: "Utilisateur mis à jour avec succès",
        ERROR: "Échec de la mise à jour de l'utilisateur",
      },
    },
  },
};
