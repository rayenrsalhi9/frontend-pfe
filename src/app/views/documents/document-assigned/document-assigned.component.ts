import { HttpEventType, HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, of } from "rxjs";
import {
  debounceTime,
  switchMap,
  catchError,
  tap,
} from "rxjs/operators";
import { Router } from "@angular/router";
import { DocumentAuditTrail } from "@app/shared/enums/document-audit-trail";
import { DocumentInfo } from "@app/shared/enums/document-info";
import { DocumentOperation } from "@app/shared/enums/document-operation";
import { DocumentResource } from "@app/shared/enums/document-resource";
import { DocumentView } from "@app/shared/enums/document-view";
import { BasePreviewComponent } from "@app/shared/preview/base-preview/base-preview.component";
import { OverlayPanel } from "@app/shared/preview/overlay-panel/overlay-panel.service";
import { CategoryService } from "@app/shared/services/category.service";
import { CommonService } from "@app/shared/services/common.service";
import { DocumentAssignedService } from "@app/shared/services/document-assigned.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Category } from "@app/shared/enums/category";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-document-assigned",
  templateUrl: "./document-assigned.component.html",
  styleUrls: ["./document-assigned.component.css"],
})
export class DocumentAssignedComponent implements OnInit, OnDestroy {
  isLoadingResults = true;
  documentResource: DocumentResource;
  categories: Category[] = [];
  allCategories: Category[] = [];
  ColumnMode = ColumnMode;

  rows: any[] = [];
  searchSubject: Subject<void> = new Subject<void>();

  constructor(
    private documentAssignedService: DocumentAssignedService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private overlay: OverlayPanel,
    private commonService: CommonService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.documentResource = new DocumentResource();
    this.documentResource.pageSize = 10;
    this.documentResource.orderBy = "createdDate desc";
  }

  ngOnInit() {
    this.getCategories();
    this.searchSubject
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoadingResults = true)),
        switchMap(() =>
          this.documentAssignedService.getDocuments(this.documentResource).pipe(
            catchError((err) => {
              console.log(err);
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

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
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

  getExpiryDate(
    maxRolePermissionEndDate: Date | any,
    maxUserPermissionEndDate: Date | any,
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

  onActivate(event) {}
}
