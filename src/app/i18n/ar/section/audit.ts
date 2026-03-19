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
        TO: "تمت المشاركة مع",
        ROLE: "الدور الممنوح",
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
