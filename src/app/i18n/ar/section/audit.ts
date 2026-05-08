export const audit = {
  AUDIT: {
    LIST: {
      TITLE: "سجل التدقيق",
      DESCRIPTION:
        "راقب نشاط المستندات وسجل الوصول وتحديثات الصلاحيات لضمان الأمان والامتثال وإمكانية التتبع الكامل.",
      TABLE: {
        DATE: "التاريخ",
        DOCUMENT_NAME: "اسم المستند",
        CATEGORY: "الفئة",
        OPERATION: "العملية",
        BY: "تم بواسطة",
        SHARED_WITH: "تمت المشاركة مع",
      },
      OPERATION: {
        CREATE: "تم الإنشاء",
        READ: "تمت المعاينة",
        DOWNLOAD: "تم التنزيل",
        DELETE: "تم الحذف",
        MODIFIED: "تم التعديل",
        ADD_PERMISSION: "تمت إضافة صلاحية",
        REMOVE_PERMISSION: "تمت إزالة صلاحية",
        SEND_EMAIL: "تم إرسال البريد الإلكتروني",
        UNKNOWN: "غير معروف",
      },
      LABELS: {
        SEARCH: "البحث باسم المستند",
        CATEGORY: "التصفية حسب الفئة",
        USER: "التصفية حسب المستخدم",
      },
      SHARED_USERS_TITLE: "المستخدمون المشاركون",
      SHARED_ROLES_TITLE: "الأدوار المشاركة",
      USERS_COUNT: "مستخدمين",
      ROLES_COUNT: "أدوار",
      LOADING_ROLES: "جار تحميل تفاصيل الدور...",
      CLOSE: "إغلاق",
      EMPTY_STATE: {
        TITLE: "لم يتم العثور على سجلات تدقيق",
        DESCRIPTION: "لا توجد أي سجلات تدقيق تطابق عوامل التصفية المحددة.",
      },
      DETAILS: {
        DOCUMENT: "المستند",
        USER: "المستخدم",
        ROLE: "الدور",
        CATEGORY: "الفئة",
        DATE: "التاريخ",
        OPERATION: "العملية",
      },
    },
  },
};
