import { HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { LoginAuditResource } from "@app/shared/enums/login-audit-resource";
import { ClonerService } from "@app/shared/services/clone.service";
import { LoginAuditService } from "@app/shared/services/login-audit.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";

@Component({
  selector: "app-login-audit",
  templateUrl: "./login-audit.component.html",
  styleUrls: ["./login-audit.component.css"],
})
export class LoginAuditComponent implements OnInit {
  isLoadingResults = true;
  loading$: Observable<boolean>;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  loginAuditResource: LoginAuditResource;

  rows: any[] = [];
  createdDate = new FormControl("");

  max = new Date();
  selected = [];

  bsModalRef: BsModalRef;

  constructor(
    public clonerService: ClonerService,
    private cdr: ChangeDetectorRef,
    private loginAuditService: LoginAuditService,
  ) {
    this.loginAuditResource = new LoginAuditResource();
  }

  ngOnInit(): void {
    this.loadLoginAudits();
  }

  loadLoginAudits() {
    this.loginAuditService.getLoginAudits(this.loginAuditResource).subscribe(
      (res: HttpResponse<any>) => {
        this.rows = res.body;
        this.cdr.detectChanges();
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
}
