import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '@app/shared/enums/category';
import { ResponseHeader } from '@app/shared/enums/document-header';
import { DocumentInfo } from '@app/shared/enums/document-info';
import { DocumentResource } from '@app/shared/enums/document-resource';
import { LoginAudit } from '@app/shared/enums/login-audit';
import { LoginAuditResource } from '@app/shared/enums/login-audit-resource';
import { OverlayPanel } from '@app/shared/preview/overlay-panel/overlay-panel.service';
import { CategoryService } from '@app/shared/services/category.service';
import { ClonerService } from '@app/shared/services/clone.service';
import { CommonService } from '@app/shared/services/common.service';
import { DocumentService } from '@app/shared/services/document.service';
import { LoginAuditService } from '@app/shared/services/login-audit.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login-audit',
  templateUrl: './login-audit.component.html',
  styleUrls: ['./login-audit.component.css']
})
export class LoginAuditComponent implements OnInit {

  documents: DocumentInfo[] = [];
  displayedColumns: string[] = [
    'select',
    'action',
    'name',
    'categoryName',
    'createdDate',
    'createdBy',
  ];
  isLoadingResults = true;
  documentResource: DocumentResource;
  categories: Category[] = [];
  allCategories: Category[] = [];
  loading$: Observable<boolean>;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  loginAuditResource:LoginAuditResource

  rows: any[] = [];
  createdDate = new FormControl('');

  max = new Date();
  selected = [];

  bsModalRef: BsModalRef;

  constructor(
    private documentService: DocumentService,
    private commonService: CommonService,
    private categoryService: CategoryService,
    public clonerService: ClonerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private overlay: OverlayPanel,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private loginAuditService: LoginAuditService
  ) {
    this.loginAuditResource = new LoginAuditResource();
  }

  ngOnInit(): void {
    this.loadLoginAudits()
  }

  loadLoginAudits() {
    this.loginAuditService.getLoginAudits(this.loginAuditResource).subscribe(
      (res: HttpResponse<any>) => {
        this.rows = res.body
        this.cdr.detectChanges();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }





}
