export const audit = {
  AUDIT: {
    LIST: {
      TITLE: "Journal d’audit",
      DESCRIPTION:
        "Surveillez l’activité des documents, l’historique des accès et les mises à jour des autorisations afin de garantir la sécurité, la conformité et une traçabilité complète.",
      TABLE: {
        DATE: "Date",
        DOCUMENT_NAME: "Nom du document",
        CATEGORY: "Catégorie",
        OPERATION: "Opération",
        BY: "Effectué par",
        TO: "Partagé avec",
        ROLE: "Rôle attribué",
      },
      OPERATION: {
        CREATE: "Créé",
        READ: "Consulté",
        DOWNLOAD: "Téléchargé",
        DELETE: "Supprimé",
        MODIFIED: "Modifié",
        ADD_PERMISSION: "Autorisation ajoutée",
        REMOVE_PERMISSION: "Autorisation supprimée",
        SEND_EMAIL: "E-mail envoyé",
        UNKNOWN: "Inconnu",
      },
      LABELS: {
        SEARCH: "Rechercher par nom de document",
        CATEGORY: "Filtrer par catégorie",
        USER: "Filtrer par utilisateur",
      },
      EMPTY_STATE: {
        TITLE: "Aucun enregistrement d’audit trouvé",
        DESCRIPTION:
          "Aucune entrée d’audit ne correspond aux filtres sélectionnés.",
      },
      DETAILS: {
        DOCUMENT: "Document",
        USER: "Utilisateur",
        ROLE: "Rôle",
        CATEGORY: "Catégorie",
        DATE: "Date",
        OPERATION: "Opération",
      },
    },
  },
};
