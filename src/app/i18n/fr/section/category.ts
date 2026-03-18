export const category = {
  CATEGORY: {
    LIST: {
      TITLE: "Catégories de documents",
      DESCRIPTION:
        "Organisez vos documents en catégories personnalisables pour une meilleure structure et un meilleur accès.",
      TABLE: {
        NAME: "nom",
        DESCRIPTION: "Description",
        CREATED: "Créé à",
        ACTIONS: "Actions",
      },
      BUTTONS: {
        ADD: "Ajouter une catégorie",
        EDIT: "Modifier",
        DELETE: "Supprimer",
      },
    },
    ADD: {
      NAME: "Nom",
      DESCRIPTION: "Description",
      BUTTONS: {
        CATEGORY_SAVE: "Enregistrer",
        CATEGORY_CANCEL: "Annuler",
      },
      ERROR: {
        CATEGORY_NAME_IS_REQUIRED: "Le nom de la catégorie est requis",
      },
      TOAST: {},
    },
    DELETE: {
      LABEL: {
        title: "Supprimer la catégorie",
        message: "Êtes-vous sûr de vouloir supprimer cette catégorie?",
        button: {
          cancel: "Annuler",
          confirm: "Confirmer",
        },
      },
      ERROR: {},
      TOAST: {
        CATEGORY_DELETED_SUCCESSFULLY: "Catégorie supprimée avec succès",
      },
    },
  },
};
