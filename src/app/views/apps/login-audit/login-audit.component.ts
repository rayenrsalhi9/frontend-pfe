import { HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { LoginAuditResource } from "@app/shared/enums/login-audit-resource";
import { ClonerService } from "@app/shared/services/clone.service";
import { LoginAuditService } from "@app/shared/services/login-audit.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { TranslateService } from "@ngx-translate/core";
import { Subject, of } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { debounceTime, switchMap, catchError, tap } from "rxjs/operators";

@Component({
  selector: "app-login-audit",
  templateUrl: "./login-audit.component.html",
  styleUrls: ["./login-audit.component.css"],
})
export class LoginAuditComponent implements OnInit {
  private destroy$ = new Subject<void>();
  isLoadingResults = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  loginAuditResource: LoginAuditResource;
  statuses: { id: string; name: string }[] = [];

  rows: any[] = [];
  totalCount: number = 0;
  searchSubject: Subject<void> = new Subject<void>();
  Math = Math;

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
    this.statuses = [
      {
        id: "success",
        name: this.translateService.instant("LOGINS.STATUS.SUCCESS"),
      },
      {
        id: "error",
        name: this.translateService.instant("LOGINS.STATUS.ERROR"),
      },
    ];
    this.searchSubject
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoadingResults = true)),
        takeUntil(this.destroy$),
        switchMap(() =>
          this.loginAuditService.getLoginAudits(this.loginAuditResource).pipe(
            catchError((err) => {
              console.log(err);
              this.isLoadingResults = false;
              return of(null);
            }),
          ),
        ),
      )
      .subscribe({
        next: (res: HttpResponse<any>) => {
          if (res) {
            this.rows = res.body;
            this.totalCount = parseInt(
              res.headers.get("totalCount") || "0",
              10,
            );
          }
          this.isLoadingResults = false;
          this.cdr.detectChanges();
        },
      });
    this.searchSubject.next();
  }

  loadLoginAudits() {
    this.searchSubject.next();
  }

  onPageChange(event: any) {
    this.loginAuditResource.skip =
      event.offset * this.loginAuditResource.pageSize;
    this.loadLoginAudits();
  }

  onUserNameChange(event: any) {
    const val = event.target.value;
    this.loginAuditResource.userName = val ? val : "";
    this.loginAuditResource.skip = 0;
    this.searchSubject.next();
  }

  onStatusChange(event: any) {
    this.loginAuditResource.status = event ? event.id : "";
    this.loginAuditResource.skip = 0;
    this.searchSubject.next();
  }

  onDateChange(event: any) {
    this.loginAuditResource.loginTime = event
      ? new Date(event).toDateString()
      : "";
    this.loginAuditResource.skip = 0;
    this.searchSubject.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
