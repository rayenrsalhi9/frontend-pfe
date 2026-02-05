import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentAuditTrail } from '@app/shared/enums/document-audit-trail';
import { DocumentInfo } from '@app/shared/enums/document-info';
import { DocumentOperation } from '@app/shared/enums/document-operation';
import { DocumentResource } from '@app/shared/enums/document-resource';
import { DocumentView } from '@app/shared/enums/document-view';
import { DocumentVersion } from '@app/shared/enums/documentVersion';
import { BasePreviewComponent } from '@app/shared/preview/base-preview/base-preview.component';
import { OverlayPanel } from '@app/shared/preview/overlay-panel/overlay-panel.service';
import { CategoryService } from '@app/shared/services/category.service';
import { ClonerService } from '@app/shared/services/clone.service';
import { CommonService } from '@app/shared/services/common.service';
import { DocumentAssignedService } from '@app/shared/services/document-assigned.service';
import { DocumentService } from '@app/shared/services/document.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DocumentCommentComponent } from '../document-comment/document-comment.component';
import { DocumentEditComponent } from '../document-edit/document-edit.component';
import { DocumentHistoryComponent } from '../document-history/document-history.component';
import { DocumentReminderComponent } from '../document-reminder/document-reminder.component';
import { DocumentSendEmailComponent } from '../document-send-email/document-send-email.component';
import { DocumentShareComponent } from '../document-share/document-share.component';
import { DocumentUploadNewVersionComponent } from '../document-upload-new-version/document-upload-new-version.component';
import { Category } from '@app/shared/enums/category';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-document-assigned',
  templateUrl: './document-assigned.component.html',
  styleUrls: ['./document-assigned.component.css']
})
export class DocumentAssignedComponent implements OnInit {

  showMobilePanel = false

  rows: any[] = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  isLoadingResults = true;
  documentResource: DocumentResource;
  categories: Category[] = [];
  allCategories: Category[] = [];
  bsModalRef: BsModalRef;

  constructor(
    private documentAssignedService: DocumentAssignedService,
    private categoryService: CategoryService,
    public clonerService: ClonerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private overlay: OverlayPanel,
    private documentService: DocumentService,
    private commonService: CommonService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.documentResource = new DocumentResource();
    this.documentResource.pageSize = 10;
    this.documentResource.orderBy = 'createdDate desc';
  }

  ngOnInit() {
    this.loadDocuments()
    this.getCategories()
  }

  addDocument() {
    this.router.navigate(['/document/add'])
  }


  loadDocuments(data = this.documentResource) {
    this.documentAssignedService.getDocuments(data).subscribe(
      (res: HttpResponse<any>) => {
        this.rows = res.body
        this.isLoadingResults = true
        this.cdr.detectChanges();
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  onCategoryChange(event: any) {
    if (event) {
      this.documentResource.categoryId = event;
    } else {
      this.documentResource.categoryId = '';
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  onNameChange(event:any) {
    let val = event.target.value
    if (val) {
      this.documentResource.name = val;
    } else {
      this.documentResource.name = '';
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  onTagChange(event:any) {
    let val = event.target.value
    if (val) {
      this.documentResource.metaTags = val;
    } else {
      this.documentResource.metaTags = '';
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  onDateChange(event:any) {
    if (event) {
      this.documentResource.createDate = new Date(event).toDateString();
    } else {
      this.documentResource.createDate = '';
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  onDocumentView(document: DocumentInfo) {

    const urls = document.url.split('.');
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
      position: 'center',
      origin: 'global',
      panelClass: ['file-preview-overlay-container', 'white-background'],
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

  editDocument(documentInfo: DocumentInfo) {

    const initialState = {
      document: documentInfo,
      categories: this.categories,
    };

    this.bsModalRef = this.modalService.show(DocumentEditComponent, { initialState });
  }

  private downloadFile(data: HttpResponse<Blob>, documentInfo: DocumentInfo) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = documentInfo.name;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  downloadDocument(documentInfo: DocumentInfo) {
    this.commonService
      .downloadDocument(documentInfo.id, false)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            this.addDocumentTrail(
              documentInfo.id,
              DocumentOperation.Download.toString()
            );
            this.downloadFile(event, documentInfo);
          }
        },
        (error) => {
          this.translate.get('DOCUMENTS.DOWNLOAD.TOAST.ERROR_WHILE_DOWNLOADING_DOCUMENT').subscribe((translatedMessage: string) => {
            this.toastr.success(translatedMessage); 
          });  
        }
      );
  }

  addDocumentTrail(id: string, operation: string) {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: id,
      operationName: operation,
    };
    this.commonService
      .addDocumentAuditTrail(objDocumentAuditTrail)
      .subscribe();
  }

  onVersionHistoryClick(document: DocumentInfo): void {
    const documentInfo = this.clonerService.deepClone<DocumentInfo>(document);


    this.documentService
      .getDocumentVersion(document.id)
      .subscribe((documentVersions: DocumentVersion[]) => {
        documentInfo.documentVersions = documentVersions;
        const initialState = {
          width: '800px',
          maxHeight: '70vh',
          panelClass: 'full-width-dialog',
          data: Object.assign({}, documentInfo),
        };
        const bsModalRef = this.modalService.show(DocumentHistoryComponent, { initialState });
      });
  }

  uploadNewVersion(document: Document) {

    const initialState = {
      width: '800px',
      maxHeight: '70vh',
      panelClass: 'full-width-dialog',
      data: Object.assign({}, document),
    };

    const dialogRef = this.modalService.show(DocumentUploadNewVersionComponent, { initialState });

    /* dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dataSource.loadDocuments(this.documentResource);
      }
    }); */
  }

  sendEmail(documentInfo: DocumentInfo) {

    const initialState = {
      data: documentInfo,
      width: '80vw',
      height: '80vh',
    };

    this.modalService.show(DocumentSendEmailComponent, { initialState });
  }

  addReminder(documentInfo: DocumentInfo) {
    const initialState = {
      data: documentInfo,
      width: '80vw',
      height: '80vh',
    };
    this.modalService.show(DocumentReminderComponent, { initialState });
  }

  addComment(document: Document) {

    const initialState = {
      width: '800px',
      maxHeight: '70vh',
      panelClass: 'full-width-dialog',
      data: Object.assign({}, document),
    };

    this.modalService.show(DocumentCommentComponent, { initialState });

    /* dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'loaded') {
        this.dataSource.loadDocuments(this.documentResource);
      }
    }); */
  }

  onSharedSelectDocument() {

    const initialState = {
      width: '800px',
      maxHeight: '70vh',
      panelClass: 'full-width-dialog',
      data: Object.assign({}, document),
    };

    const dialogRef = this.modalService.show(DocumentShareComponent, { initialState });
  }

  deleteDocument(document: DocumentInfo) {
    this.translate.get('DOCUMENTS.DELETE.LABEL').subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm
          }
        }
      });
    }); 

    this.bsModalRef.content.onClose.subscribe(result => {

      if(result) {
        this.documentService
          .deleteDocument(document.id)
          .subscribe(() => {
            this.addDocumentTrail(
              document.id,
              DocumentOperation.Deleted.toString()
            );
            this.translate.get('DOCUMENTS.DELETE.TOAST.DOCUMENT_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
              this.toastr.success(translatedMessage); // Display translated message using Toastr
            }); 
            this.loadDocuments();
          });
      }

    })

  }

  getExpiryDate(
    maxRolePermissionEndDate: Date | any,
    maxUserPermissionEndDate: Date | any
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
    const cells = document.getElementsByClassName('datatable-body-cell overflow-visible');

    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].setAttribute('style', 'overflow: visible !important');
    }
  }

  onSelect({ selected }) {

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

}
