import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Category } from "@app/shared/enums/category";
import { DocumentInfo } from "@app/shared/enums/document-info";
import { DocumentResource } from "@app/shared/enums/document-resource";
import { ClonerService } from "@app/shared/services/clone.service";
import { DocumentService } from "@app/shared/services/document.service";
import { CategoryService } from "@app/shared/services/category.service";
import { CommonService } from "@app/shared/services/common.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { DocumentView } from "@app/shared/enums/document-view";
import { BasePreviewComponent } from "@app/shared/preview/base-preview/base-preview.component";
import { DocumentEditComponent } from "../document-edit/document-edit.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { TranslateService } from "@ngx-translate/core";
import { Subject, of, Observable } from "rxjs";
import { debounceTime, switchMap, catchError, tap } from "rxjs/operators";
import { DocumentAuditTrail } from "@app/shared/enums/document-audit-trail";
import { DocumentOperation } from "@app/shared/enums/document-operation";
import { ToastrService } from "ngx-toastr";
import { DocumentVersion } from "@app/shared/enums/documentVersion";
import { DocumentUploadNewVersionComponent } from "../document-upload-new-version/document-upload-new-version.component";
import { DocumentHistoryComponent } from "../document-history/document-history.component";
import { DocumentSendEmailComponent } from "../document-send-email/document-send-email.component";
import { DocumentCommentComponent } from "../document-comment/document-comment.component";
import { DocumentShareComponent } from "../document-share/document-share.component";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { OverlayPanel } from "@app/shared/preview/overlay-panel/overlay-panel.service";

@Component({
  selector: "app-document-list",
  templateUrl: "./document-list.component.html",
  styleUrls: ["./document-list.component.css"],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: DocumentInfo[] = [];
  displayedColumns: string[] = [
    "select",
    "action",
    "name",
    "categoryName",
    "createdDate",
    "createdBy",
  ];
  isLoadingResults = true;
  documentResource: DocumentResource;
  categories: Category[] = [];
  allCategories: Category[] = [];
  loading$: Observable<boolean>;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  rows: any[] = [];
  createdDate = new FormControl("");

  max = new Date();
  selected = [];

  bsModalRef: BsModalRef;
  searchSubject: Subject<void> = new Subject<void>();

  constructor(
    private documentService: DocumentService,
    private commonService: CommonService,
    private categoryService: CategoryService,
    public clonerService: ClonerService,
    private cdr: ChangeDetectorRef,
    private overlay: OverlayPanel,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.documentResource = new DocumentResource();
    this.documentResource.pageSize = 10;
    this.documentResource.orderBy = "createdDate desc";
  }

  ngOnInit(): void {
    this.getCategories();
    this.searchSubject
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoadingResults = true)),
        switchMap(() =>
          this.documentService.getDocuments(this.documentResource).pipe(
            catchError((err) => {
              console.error(`Error fetching documents: ${err}`);
              this.isLoadingResults = false;
              return of(null);
            }),
          ),
        ),
      )
      .subscribe((res: HttpResponse<any>) => {
        if (res) {
          this.rows = res.body;
        }
        this.isLoadingResults = false;
        this.cdr.detectChanges();
      });
    this.searchSubject.next();
  }

  ngOnDestroy(): void {
    this.searchSubject.unsubscribe();
  }

  getCategories(): void {
    this.categoryService.getAllCategoriesForDropDown().subscribe((c) => {
      this.categories = [...c];
      this.setDeafLevel();
    });
  }

  setDeafLevel(parent?: Category, parentId?: string) {
    const children = this.categories.filter((c) => c.parentId == parentId);
    if (children.length > 0) {
      children.map((c, index) => {
        c.deafLevel = parent ? parent.deafLevel + 1 : 0;
        c.index =
          (parent ? parent.index : 0) + index * Math.pow(0.1, c.deafLevel);
        this.allCategories.push(c);
        this.setDeafLevel(c, c.id);
      });
    }
    return parent;
  }

  loadDocuments(data = this.documentResource) {
    this.documentResource = data;
    this.searchSubject.next();
  }

  onCategoryChange(event: any) {
    this.documentResource.categoryId = event ? event : "";
    this.documentResource.skip = 0;
    this.searchSubject.next();
  }

  onNameChange(event: any) {
    const val = event.target.value;
    this.documentResource.name = val ? val : "";
    this.documentResource.skip = 0;
    this.searchSubject.next();
  }

  onTagChange(event: any) {
    const val = event.target.value;
    this.documentResource.metaTags = val ? val : "";
    this.documentResource.skip = 0;
    this.searchSubject.next();
  }

  onDateChange(event: any) {
    this.documentResource.createDate = event
      ? new Date(event).toDateString()
      : "";
    this.documentResource.skip = 0;
    this.searchSubject.next();
  }

  onDocumentView(document: DocumentInfo) {
    const urls = document.url.split(".");
    const extension = urls[1];
    const documentView: DocumentView = {
      documentId: document.id,
      name: document.name,
      extension: extension,
      isRestricted: document.isAllowDownload,
      isVersion: false,
      isFromPreview: true,
    };
    this.overlay.open(BasePreviewComponent, {
      position: "center",
      origin: "global",
      panelClass: ["file-preview-overlay-container", "white-background"],
      data: documentView,
    });
  }

  getExpiryDate(
    maxRolePermissionEndDate: Date,
    maxUserPermissionEndDate: Date,
  ) {
    if (maxRolePermissionEndDate && maxUserPermissionEndDate) {
      return maxRolePermissionEndDate > maxUserPermissionEndDate
        ? maxRolePermissionEndDate
        : maxUserPermissionEndDate;
    } else if (maxRolePermissionEndDate) {
      return maxRolePermissionEndDate;
    } else if (maxUserPermissionEndDate) {
      return maxUserPermissionEndDate;
    } else {
      return null;
    }
  }

  ngAfterViewInit() {
    this.cellOverflowVisible();
  }

  private cellOverflowVisible() {
    const cells = document.getElementsByClassName(
      "datatable-body-cell overflow-visible",
    );
    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].setAttribute("style", "overflow: visible !important");
    }
  }

  editDocument(documentInfo: DocumentInfo) {
    const initialState = {
      document: documentInfo,
      categories: this.categories,
    };

    this.bsModalRef = this.modalService.show(DocumentEditComponent, {
      initialState,
    });
  }

  private downloadFile(data: HttpResponse<Blob>, documentInfo: DocumentInfo) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement("a");
    a.setAttribute("style", "display:none;");
    document.body.appendChild(a);
    a.download = documentInfo.name;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = "_blank";
    a.click();
    document.body.removeChild(a);
  }

  downloadDocument(documentInfo: DocumentInfo) {
    this.commonService.downloadDocument(documentInfo.id, false).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          this.addDocumentTrail(
            documentInfo.id,
            DocumentOperation.Download.toString(),
          );
          this.downloadFile(event, documentInfo);
        }
      },
      (error) => {
        this.translate
          .get("DOCUMENTS.DOWNLOAD.TOAST.ERROR_WHILE_DOWNLOADING_DOCUMENT")
          .subscribe((translatedMessage: string) => {
            this.toastr.success(translatedMessage);
          });
      },
    );
  }

  addDocumentTrail(id: string, operation: string) {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: id,
      operationName: operation,
    };
    this.commonService.addDocumentAuditTrail(objDocumentAuditTrail).subscribe();
  }

  onVersionHistoryClick(document: DocumentInfo): void {
    const documentInfo = this.clonerService.deepClone<DocumentInfo>(document);

    this.documentService
      .getDocumentVersion(document.id)
      .subscribe((documentVersions: DocumentVersion[]) => {
        documentInfo.documentVersions = documentVersions;

        const initialState = {
          width: "800px",
          maxHeight: "70vh",
          panelClass: "full-width-dialog",
          data: Object.assign({}, documentInfo),
        };

        const dialogRef = this.modalService.show(DocumentHistoryComponent, {
          initialState,
        });
      });
  }

  uploadNewVersion(document: Document) {
    const initialState = {
      width: "800px",
      maxHeight: "70vh",
      panelClass: "full-width-dialog",
      data: Object.assign({}, document),
    };

    const dialogRef = this.modalService.show(
      DocumentUploadNewVersionComponent,
      { initialState },
    );
  }

  sendEmail(documentInfo: DocumentInfo) {
    const initialState = {
      data: documentInfo,
      width: "80vw",
      height: "80vh",
    };

    this.modalService.show(DocumentSendEmailComponent, { initialState });
  }

  addComment(document: Document) {
    const initialState = {
      width: "800px",
      maxHeight: "70vh",
      panelClass: "full-width-dialog",
      data: Object.assign({}, document),
    };

    this.modalService.show(DocumentCommentComponent, { initialState });
  }

  onSharedSelectDocument(document: Document) {
    const initialState = {
      width: "800px",
      maxHeight: "70vh",
      panelClass: "modal-lg",
      data: Object.assign({}, document),
    };

    const dialogRef = this.modalService.show(DocumentShareComponent, {
      initialState: initialState,
    });
  }

  deleteDocument(document: DocumentInfo) {
    this.translate.get("DOCUMENTS.DELETE.LABEL").subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        class: "modal-confirm-custom",
        initialState: {
          title: translations.TITLE,
          message: translations.MESSAGE,
          button: {
            cancel: translations.BUTTON.CANCEL,
            confirm: translations.BUTTON.CONFIRM,
          },
        },
      });

      this.bsModalRef.content.onClose.subscribe((result) => {
        if (result) {
          this.documentService.deleteDocument(document.id).subscribe(() => {
            this.addDocumentTrail(
              document.id,
              DocumentOperation.Deleted.toString(),
            );
            this.translate
              .get("DOCUMENTS.DELETE.TOAST.DOCUMENT_DELETED_SUCCESSFULLY")
              .subscribe((translatedMessage: string) => {
                this.toastr.success(translatedMessage); // Display translated message using Toastr
              });
            this.loadDocuments();
          });
        }
      });
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {}
}
