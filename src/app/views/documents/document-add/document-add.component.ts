import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "@app/shared/enums/category";
import { DocumentAuditTrail } from "@app/shared/enums/document-audit-trail";
import { DocumentInfo } from "@app/shared/enums/document-info";
import { DocumentOperation } from "@app/shared/enums/document-operation";
import { DocumentMetaData } from "@app/shared/enums/documentMetaData";
import { DocumentPermission } from "@app/shared/enums/document-permission";
import { FileInfo } from "@app/shared/enums/file-info";
import { User } from "@app/shared/enums/user-auth";
import { CategoryService } from "@app/shared/services/category.service";
import { CommonService } from "@app/shared/services/common.service";
import { DocumentService } from "@app/shared/services/document.service";
import { DocumentPermissionService } from "@app/shared/services/document-permission.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-document-add",
  templateUrl: "./document-add.component.html",
  styleUrls: ["./document-add.component.scss"],
})
export class DocumentAddComponent implements OnInit {
  document: DocumentInfo;
  documentForm: FormGroup;
  extension = "";
  categories: Category[] = [];
  allCategories: Category[] = [];
  isLoading: boolean;
  documentSource: string;
  progress = 0;
  message = "";
  fileInfo: FileInfo;
  isFileUpload = false;
  fileData: any;
  users: User[];
  selectedUsers: User[] = [];
  isEditMode = false;
  editDocumentId: string;

  get documentMetaTagsArray(): FormArray {
    return this.documentForm.get("documentMetaTags") as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private categoryService: CategoryService,
    private commonService: CommonService,
    private documentService: DocumentService,
    private documentPermissionService: DocumentPermissionService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.createDocumentForm();
    this.getCategories();
    this.documentMetaTagsArray.push(this.buildDocumentMetaTag());
    this.getUsers();

    this.route.queryParams.subscribe((params) => {
      if (params["edit"]) {
        this.isEditMode = true;
        this.editDocumentId = params["edit"];
        this.loadDocumentForEdit(this.editDocumentId);
      }
    });
  }

  loadDocumentForEdit(id: string) {
    this.isLoading = true;
    this.documentService.getDocument(id).subscribe({
      next: (doc: DocumentInfo) => {
        this.document = doc;
        this.documentForm.patchValue({
          name: doc.name,
          description: doc.description,
          categoryId: doc.categoryId,
        });
        this.documentMetaTagsArray.clear();
        if (doc.documentMetaDatas && doc.documentMetaDatas.length > 0) {
          doc.documentMetaDatas.forEach((meta) => {
            this.documentMetaTagsArray.push(this.editDocmentMetaData(meta));
          });
        } else {
          this.documentMetaTagsArray.push(this.buildDocumentMetaTag());
        }
        this.loadDocumentPermissions(id);
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  loadDocumentPermissions(id: string) {
    this.documentPermissionService
      .getDocumentPermission(id)
      .subscribe({
        next: (permissions: DocumentPermission[]) => {
          const userPerms = permissions.filter((p) => p.type === "User");
          this.selectedUsers = userPerms
            .map((p) => this.users?.find((u) => u.id === p.userId))
            .filter(Boolean);
          if (userPerms.length > 0) {
            this.userPermissionFormGroup.patchValue({
              isAllowDownload: userPerms[0].isAllowDownload,
            });
          }
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cd.detectChanges();
        },
      });
  }

  getUsers() {
    this.commonService
      .getUsersForDropdown()
      .subscribe((users: User[]) => {
        this.users = users;
        if (this.isEditMode && this.editDocumentId) {
          this.loadDocumentPermissions(this.editDocumentId);
        }
      });
  }

  selectUser(event: any) {
    if (event[0] === "all") {
      this.selectedUsers = this.users;
    } else {
      this.selectedUsers = event;
    }
  }

  getCategories() {
    this.categoryService.getAllCategoriesForDropDown().subscribe((c) => {
      this.categories = c;
      this.setDeafLevel(undefined, null);
    });
  }

  setDeafLevel(parent?: Category, parentId?: string) {
    const children = this.categories.filter((c) => c.parentId === parentId);
    children.forEach((c) => {
      c.deafLevel = parent ? parent.deafLevel + 1 : 0;
      c.index =
        (parent ? parent.index : 0) +
        children.indexOf(c) * Math.pow(0.1, c.deafLevel);
      this.allCategories.push(c);
      this.setDeafLevel(c, c.id);
    });
    return parent;
  }

  createDocumentForm() {
    this.documentForm = this.fb.group({
      name: ["", [Validators.required]],
      description: [""],
      categoryId: ["", [Validators.required]],
      url: [""],
      extension: [""],
      documentMetaTags: this.fb.array([]),
      selectedUsers: [],
      userPermissionForm: this.fb.group({
        isAllowDownload: new FormControl(false),
      }),
    });
  }

  buildDocumentMetaTag(): FormGroup {
    return this.fb.group({
      id: [""],
      documentId: [""],
      metatag: [""],
    });
  }

  get userPermissionFormGroup() {
    return this.documentForm.get("userPermissionForm") as FormGroup;
  }

  onMetatagChange(event: any, index: number) {
    const email = this.documentMetaTagsArray.at(index).get("metatag").value;
    if (!email) {
      return;
    }
    const emailControl = this.documentMetaTagsArray.at(index).get("metatag");
    emailControl.setValidators([Validators.required]);
    emailControl.updateValueAndValidity();
  }

  editDocmentMetaData(documentMetatag: DocumentMetaData): FormGroup {
    return this.fb.group({
      id: [documentMetatag.id],
      documentId: [documentMetatag.documentId],
      metatag: [documentMetatag.metatag],
    });
  }

  saveDocument() {
    if (this.isEditMode) {
      this.updateDocument();
    } else {
      this.addDocument();
    }
  }

  addDocument() {
    if (this.documentForm.valid) {
      const doc = this.buildDocumentObject();
      this.documentService.addDocument(doc).subscribe((response: any) => {
        const documentId = typeof response === "string" ? response : response?.id;
        if (documentId) {
          this.addDocumentTrail(documentId, DocumentOperation.Created);
        }
        this.translate
          .get("DOCUMENTS.ADD.TOAST.DOCUMENT_SAVE_SUCCESSFULLY")
          .subscribe((translatedMessage: string) => {
            this.toastr.success(translatedMessage);
          });
        this.router.navigate(["/document/list"]);
      });
    } else {
      this.documentForm.markAllAsTouched();
    }
  }

  updateDocument() {
    if (this.documentForm.valid) {
      const doc = this.buildDocumentObject();
      this.documentService.updateDocument(doc).subscribe(() => {
        this.addDocumentTrail(this.editDocumentId, DocumentOperation.Modified);
        this.translate
          .get("DOCUMENTS.EDIT.TOAST.DOCUMENT_UPDATE_SUCCESSFULLY")
          .subscribe((translatedMessage: string) => {
            this.toastr.success(translatedMessage);
          });
        this.router.navigate(["/document/list"]);
      });
    } else {
      this.documentForm.markAllAsTouched();
    }
  }

  addDocumentTrail(id: string, operation: DocumentOperation) {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: id,
      operationName: operation.toString(),
    };
    this.commonService.addDocumentAuditTrail(objDocumentAuditTrail).subscribe();
  }

  buildDocumentObject(): DocumentInfo {
    const documentMetaTags = this.documentMetaTagsArray.getRawValue();

    const document: DocumentInfo = {
      id: this.isEditMode ? this.editDocumentId : undefined,
      categoryId: this.documentForm.get("categoryId").value,
      description: this.documentForm.get("description").value,
      name: this.documentForm.get("name").value,
      url: this.fileData ? this.fileData.fileName : this.document?.url,
      documentMetaDatas: [...documentMetaTags],
      fileData: this.fileData,
    };
    if (this.selectedUsers.length > 0) {
      document.documentUserPermissions = this.selectedUsers.map((user) => {
        return Object.assign(
          {},
          {
            id: "",
            documentId: this.isEditMode ? this.editDocumentId : "",
            userId: user.id,
          },
          this.userPermissionFormGroup.value,
        );
      });
    }
    return document;
  }

  onAddAnotherMetaTag() {
    const documentMetaTag: DocumentMetaData = {
      id: "",
      documentId: this.document && this.document.id ? this.document.id : "",
      metatag: "",
    };
    this.documentMetaTagsArray.insert(
      0,
      this.editDocmentMetaData(documentMetaTag),
    );
  }

  onDeleteMetaTag(index: number) {
    this.documentMetaTagsArray.removeAt(index);
  }

  upload(files) {
    if (files.length === 0) {
      return;
    }
    this.extension = files[0].name.split(".").pop();
    if (!this.fileExtesionValidation(this.extension)) {
      this.fileUploadExtensionValidation("");
      this.cd.markForCheck();
      return;
    } else {
      this.fileUploadExtensionValidation("valid");
    }

    this.fileData = files[0];
    this.documentForm.get("url").setValue(files[0].name);
    this.documentForm.get("name").setValue(files[0].name);
  }

  fileUploadExtensionValidation(extension: string) {
    this.documentForm.patchValue({
      extension: extension,
    });
    this.documentForm.get("extension").markAsTouched();
    this.documentForm.updateValueAndValidity();
  }

  fileExtesionValidation(extesion: string): boolean {
    const allowExtesions = environment.allowExtesions;
    const allowTypeExtenstion = allowExtesions.find((c) =>
      c.extentions.find((ext) => ext === extesion),
    );
    return allowTypeExtenstion ? true : false;
  }
}
