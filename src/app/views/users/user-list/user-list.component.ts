import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { CommonError } from "@app/core/error-handler/common-error";
import { User } from "@app/shared/enums/user";
import { CommonService } from "@app/shared/services/common.service";
import { UserService } from "@app/shared/services/user.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { UserPasswordEditComponent } from "../user-password-edit/user-password-edit.component";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { SecurityService } from "@app/core/security/security.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
})
export class UserListComponent implements OnInit {
  showMobilePanel = false;
  users: User[] = [];
  allUsers: any[] = [];
  rows: any[] = [];
  selected = [];
  searchTerm: string = "";

  bsModalRef: BsModalRef;
  searchSubject: Subject<string> = new Subject<string>();
  private destroy$ = new Subject<void>();

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  isLoadingResults = false;
  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    private translate: TranslateService,
    private securityService: SecurityService,
  ) {}

  ngOnInit() {
    this.getUsers();
    this.searchSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe((val: string) => {
      this.searchTerm = val;
      this.applyFilter();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteUser(user: User) {
    this.translate.get("USERS.DELETE.LABEL").subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm,
          },
        },
      });
    });
    this.bsModalRef.content.onClose.subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe(() => {
          this.translate
            .get("USERS.DELETE.TOAST.USER_DELETED_SUCCESSFULLY")
            .subscribe((translatedMessage: string) => {
              this.toastrService.success(translatedMessage);
            });
          this.getUsers();
        });
      }
    });
  }

  getUsers(): void {
    this.isLoadingResults = true;
    this.commonService.getUsers().subscribe(
      (data: any) => {
        this.isLoadingResults = false;
        this.allUsers = data;
        this.applyFilter();
        this.cdr.detectChanges();
      },
      (err: CommonError) => {
        err.messages.forEach((msg) => {
          this.toastrService.error(msg);
          this.isLoadingResults = false;
          this.cdr.detectChanges();
        });
      },
    );
  }

  resetPassword(user: User): void {
    const initialState = {
      data: Object.assign({}, user),
    };

    this.modalService.show(UserPasswordEditComponent, { initialState });
  }

  editUser(userId: string) {
    this.router.navigate(["/user/user-edit", userId]);
  }

  canEdit(row: any): boolean {
    return this.securityService.hasClaim("USER_EDIT_USER");
  }

  canResetPassword(row: any): boolean {
    return this.securityService.hasClaim("USER_RESET_PASSWORD");
  }

  canDelete(row: any): boolean {
    return this.securityService.hasClaim("USER_DELETE_USER");
  }

  hasAnyUserActions(row: any): boolean {
    return (
      this.canEdit(row) || this.canResetPassword(row) || this.canDelete(row)
    );
  }

  onSearchChange(event: any) {
    const val = event.target.value.toLowerCase();
    this.searchSubject.next(val);
  }

  private applyFilter() {
    if (this.searchTerm) {
      this.rows = this.allUsers.filter(
        (u) =>
          u.userName?.toLowerCase().includes(this.searchTerm) ||
          u.email?.toLowerCase().includes(this.searchTerm) ||
          u.firstName?.toLowerCase().includes(this.searchTerm) ||
          u.lastName?.toLowerCase().includes(this.searchTerm),
      );
    } else {
      this.rows = [...this.allUsers];
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

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {}

  remove() {
    this.selected = [];
  }
}
