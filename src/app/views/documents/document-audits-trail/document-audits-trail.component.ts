import { HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

import { CommonError } from "@app/core/error-handler/common-error";
import { DocumentResource } from "@app/shared/enums/document-resource";
import { User } from "@app/shared/enums/user-auth";
import { DocumentAuditTrail } from "@app/shared/enums/document-audit-trail";
import { Category } from "@app/shared/enums/category";
import { Role } from "@app/shared/enums/role";
import { CategoryService } from "@app/shared/services/category.service";
import { CommonService } from "@app/shared/services/common.service";
import { DocumentAuditTrailService } from "@app/shared/services/document-audit-trail.service";
import { RoleService } from "@app/shared/services/role.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-document-audits-trail",
  templateUrl: "./document-audits-trail.component.html",
  styleUrls: ["./document-audits-trail.component.scss"],
})
export class DocumentAuditsTrailComponent implements OnInit, OnDestroy {
  nameChange$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  showMobilePanel = false;

  rows: DocumentAuditTrail[] = [];
  users: User[] = [];
  roles: Role[] = [];
  categories: Category[] = [];
  totalCount: number = 0;

  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  documentResource: DocumentResource;

  bsModalRef: BsModalRef;
  sharedUsersList: { name: string; email: string }[] = [];
  sharedRolesList: { roleName: string; roleId: string; users: { name: string; email: string }[] }[] = [];
  modalLoading = false;

  constructor(
    private documentAuditTrailService: DocumentAuditTrailService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private categoryService: CategoryService,
    private roleService: RoleService,
    private modalService: BsModalService,
  ) {
    this.documentResource = new DocumentResource();
    this.documentResource.orderBy = "createdDate desc";
    this.documentResource.pageSize = 10;
  }

  ngOnInit() {
    this.loadDocuments();
    this.getUsers();
    this.getRoles();
    this.getCategories();

    this.nameChange$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val) => {
        this.documentResource.name = val;
        this.documentResource.skip = 0;
        this.loadDocuments(this.documentResource);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.nameChange$.complete();
  }

  loadDocuments(data = this.documentResource) {
    this.documentAuditTrailService.getDocumentAuditTrials(data).subscribe({
      next: (res: HttpResponse<any>) => {
        this.rows = res.body;
        this.totalCount = parseInt(res.headers.get("totalCount") || "0", 10);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(`Failed to load documents: ${err}`);
      },
    });
  }

  getUsers(): void {
    this.commonService.getUsersForDropdown().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err: CommonError) => {
        console.error(`Failed to load users: ${err}`);
      },
    });
  }

  getRoles(): void {
    this.commonService.getRolesForDropdown().subscribe({
      next: (data: Role[]) => {
        this.roles = data;
      },
      error: (err: CommonError) => {
        console.error(`Failed to load roles: ${err}`);
      },
    });
  }

  getCategories(): void {
    this.categoryService.getAllCategoriesForDropDown().subscribe({
      next: (c) => {
        this.categories = c;
      },
      error: (err) => {
        console.error(`Failed to load categories: ${err}`);
      },
    });
  }

  onNameChange(event: any) {
    const val = event.target.value;
    this.nameChange$.next(val || "");
  }

  onCategoryChange(event: any) {
    if (event) {
      this.documentResource.categoryId = event;
    } else {
      this.documentResource.categoryId = "";
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  onUserChange(event: any) {
    if (event) {
      this.documentResource.createdBy = event;
    } else {
      this.documentResource.createdBy = "";
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onPage(event: any) {
    this.documentResource.skip = event.offset * event.pageSize;
    this.loadDocuments(this.documentResource);
  }

  getOperationKey(value: string): string {
    if (!value) return "UNKNOWN";

    if (value === "Created" || value === "Create") return "CREATE";
    if (value === "Deleted" || value === "Delete") return "DELETE";

    return value.toUpperCase();
  }

  getBadgeClass(value: string): string {
    if (!value) return "badge-soft-secondary";

    const operation = value.toLowerCase();

    if (operation.includes("create") || operation.includes("add_permission")) {
      return "badge-soft-success";
    }
    if (operation.includes("read")) {
      return "badge-soft-primary";
    }
    if (
      operation.includes("download") ||
      operation.includes("modified") ||
      operation.includes("send_email")
    ) {
      return "badge-soft-info";
    }
    if (operation.includes("remove_permission")) {
      return "badge-soft-warning";
    }
    if (operation.includes("delete")) {
      return "badge-soft-danger";
    }

    return "badge-soft-secondary";
  }

  hasSharedUsers(row: DocumentAuditTrail): boolean {
    return !!row.assignToUserId;
  }

  hasSharedRoles(row: DocumentAuditTrail): boolean {
    return !!row.assignToRoleId;
  }



  openSharedRolesModal(template: TemplateRef<any>, row: DocumentAuditTrail) {
    const roleIds = row.assignToRoleId ? row.assignToRoleId.split(",") : [];
    this.sharedRolesList = [];
    this.modalLoading = true;
    this.bsModalRef = this.modalService.show(template);

    const roleDetailRequests = roleIds.map((id) => {
      const role = this.roles.find((r) => r.id === id);
      return {
        roleId: id,
        roleName: role ? role.name : id,
        userRequest: this.roleService.getRoleUsers(id),
      };
    });

    if (roleDetailRequests.length === 0) {
      this.modalLoading = false;
      return;
    }

    forkJoin(roleDetailRequests.map((r) => r.userRequest)).subscribe({
      next: (results) => {
        this.sharedRolesList = results.map((users: any, index) => ({
          roleName: roleDetailRequests[index].roleName,
          roleId: roleDetailRequests[index].roleId,
          users: (users || []).map((u: any) => ({
            name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.userName || u.userId,
            email: u.email || "",
          })),
        }));
        this.modalLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.modalLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openSharedUsersModal(template: TemplateRef<any>, row: DocumentAuditTrail) {
    const userIds = row.assignToUserId ? row.assignToUserId.split(",") : [];
    this.sharedUsersList = userIds.map((id) => {
      const user = this.users.find((u) => u.id === id);
      return {
        name: user ? `${user.firstName} ${user.lastName}` : id,
        email: user ? user.email : "",
      };
    });
    this.bsModalRef = this.modalService.show(template);
  }
}
