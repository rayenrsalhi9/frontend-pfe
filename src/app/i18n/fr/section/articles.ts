export const articles = {
  ARTICLES: {
    LIST: {
      TITLE: "Articles",
      DESCRIPTION:
        "Créez, publiez et gérez les actualités, annonces et articles informatifs de l’entreprise depuis un seul endroit.",
      TABLES: {
        SEARCH_BY_NAME: "Rechercher par titre",
        SEARCH_BY_CATEGORY: "Filtrer par catégorie",
        SEARCH_BY_DATE: "Filtrer par date",
        PICTURE: "Image de couverture",
        TITLE: "Titre",
        CATEGORY: "Catégorie",
        CREATED_BY: "Créé par",
        CREATED_AT: "Créé le",
        REPLIES: "Réponses",
        PRIVACY: "Visibilité",
        ACTIONS: "Actions",
      },
      PRIVACY: {
        PUBLIC: "Public",
        PRIVATE: "Privé",
      },
      BUTTONS: {
        VIEW: "Voir",
        ADD: "Ajouter un article",
        EDIT: "Modifier",
        DELETE: "Supprimer",
        COMMENTS: "Commentaires",
      },
      EMPTY_STATE: {
        TITLE: "Aucun article trouvé",
        DESCRIPTION: "Aucun article ne correspond aux filtres sélectionnés.",
      },
    },
    ADD: {
      LABEL: {
        TITLE: "Titre",
        CATEGORY: "Catégorie",
        DESCRIPTION: "Description courte",
        BODY: "Contenu",
        PRIVATE: "Privé",
        USERS: "Utilisateurs",
        PICTURE: "Image de couverture",
        CHANGE_PICTURE: "Changer l’image",
      },
      BUTTONS: {
        SAVE: "Enregistrer",
        CANCEL: "Annuler",
      },
      ERRORS: {
        TITLE_IS_REQUIRED: "Le titre est requis.",
        CATEGORY_IS_REQUIRED: "La catégorie est requise.",
        DESCRIPTION_IS_REQUIRED: "La description courte est requise.",
        BODY_IS_REQUIRED: "Le contenu est requis.",
        PICTURE_IS_REQUIRED: "L’image est requise.",
        ID_MISSING: "L'identifiant de l'article est manquant.",
      },
      TOAST: {
        ADDED_SUCCESS: "Article créé avec succès.",
        UPDATED_SUCCESSFULLY: "Article mis à jour avec succès.",
      },
    },
    DELETE: {
      LABEL: {
        TITLE: "Supprimer l’article",
        MESSAGE: "Êtes-vous sûr de vouloir supprimer cet article ?",
        BUTTON: {
          CANCEL: "Annuler",
          CONFIRM: "Confirmer",
        },
      },
      ERROR: {},
      TOAST: {
        ARTICLE_DELETED_SUCCESSFULLY: "Article supprimé avec succès.",
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
      TITLE: "Commentaires de l'Article",
      FETCHING: "Récupération de la conversation...",
      TOTAL_CONTRIBUTIONS: "Total des contributions",
      ADMIN_ONLY: "Contrôle Super Admin uniquement",
      EMPTY_STATE: "Aucun commentaire n'a encore été partagé ici.",
      TOOLTIP_DELETE: "Supprimer le commentaire",
      BUTTON_DISMISS: "Fermer",
    },
    CATEGORIES: {
      TITLE: "Catégories d’articles",
      DESCRIPTION:
        "Organisez les articles par catégories afin d’aider les utilisateurs à trouver plus facilement le contenu pertinent.",
    },
  },
};
