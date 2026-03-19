import { HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { LoginAuditResource } from "@app/shared/enums/login-audit-resource";
import { ClonerService } from "@app/shared/services/clone.service";
import { LoginAuditService } from "@app/shared/services/login-audit.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-login-audit",
  templateUrl: "./login-audit.component.html",
  styleUrls: ["./login-audit.component.css"],
})
export class LoginAuditComponent implements OnInit {
  isLoadingResults = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  loginAuditResource: LoginAuditResource;
  statuses = [
    { id: 'success', name: this.translateService.instant('LOGINS.STATUS.SUCCESS') },
    { id: 'error', name: this.translateService.instant('LOGINS.STATUS.ERROR') }
  ];

  rows: any[] = [];
  totalCount: number = 0;

  constructor(
    public clonerService: ClonerService,
    private cdr: ChangeDetectorRef,
    private loginAuditService: LoginAuditService,
    private translateService: TranslateService,
  ) {
    this.loginAuditResource = new LoginAuditResource();
    this.loginAuditResource.pageSize = 6;
  }

  ngOnInit(): void {
    this.loadLoginAudits();
  }

  loadLoginAudits() {
    this.isLoadingResults = true;
    this.loginAuditService.getLoginAudits(this.loginAuditResource).subscribe({
      next: (res: HttpResponse<any>) => {
        this.rows = res.body;
        this.totalCount = parseInt(res.headers.get('totalCount') || '0', 10);
        this.isLoadingResults = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      },
    });
  }

  onPageChange(event: any) {
    this.loginAuditResource.skip = event.offset * this.loginAuditResource.pageSize;
    this.loadLoginAudits();
  }

  onUserNameChange(event: any) {
    const val = event.target.value;
    if (val) {
      this.loginAuditResource.userName = val;
    } else {
      this.loginAuditResource.userName = '';
    }
    this.loginAuditResource.skip = 0;
    this.loadLoginAudits();
  }

  onStatusChange(event: any) {
    if (event) {
      this.loginAuditResource.status = event.id;
    } else {
      this.loginAuditResource.status = '';
    }
    this.loginAuditResource.skip = 0;
    this.loadLoginAudits();
  }

  onDateChange(event: any) {
    if (event) {
      this.loginAuditResource.loginTime = new Date(event).toDateString();
    } else {
      this.loginAuditResource.loginTime = '';
    }
    this.loginAuditResource.skip = 0;
    this.loadLoginAudits();
  }
}
