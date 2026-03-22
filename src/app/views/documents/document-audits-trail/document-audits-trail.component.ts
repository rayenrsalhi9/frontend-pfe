import { HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

import { CommonError } from "@app/core/error-handler/common-error";
import { DocumentResource } from "@app/shared/enums/document-resource";
import { User } from "@app/shared/enums/user-auth";
import { DocumentAuditTrail } from "@app/shared/enums/document-audit-trail";
import { Category } from "@app/shared/enums/category";
import { CategoryService } from "@app/shared/services/category.service";
import { CommonService } from "@app/shared/services/common.service";
import { DocumentAuditTrailService } from "@app/shared/services/document-audit-trail.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-document-audits-trail",
  templateUrl: "./document-audits-trail.component.html",
  styleUrls: ["./document-audits-trail.component.css"],
})
export class DocumentAuditsTrailComponent implements OnInit, OnDestroy {
  nameChange$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  showMobilePanel = false;

  rows: DocumentAuditTrail[] = [];
  users: User[] = [];
  categories: Category[] = [];
  totalCount: number = 0;

  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  documentResource: DocumentResource;

  constructor(
    private documentAuditTrailService: DocumentAuditTrailService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private categoryService: CategoryService,
  ) {
    this.documentResource = new DocumentResource();
    this.documentResource.orderBy = "createdDate desc";
    this.documentResource.pageSize = 10;
  }

  ngOnInit() {
    this.loadDocuments();
    this.getUsers();
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

    // Explicit mapping for cases where uppercase doesn't match the i18n key exactly
    if (value === "Created" || value === "Create") return "CREATE";
    if (value === "Deleted" || value === "Delete") return "DELETE";

    // For others, we assume the i18n key is the uppercase version of the operation name
    // e.g., 'Add_Permission' -> 'ADD_PERMISSION', 'Read' -> 'READ', etc.
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
}
