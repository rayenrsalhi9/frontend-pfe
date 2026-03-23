import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { Role } from "@app/shared/enums/role";
import { CommonService } from "@app/shared/services/common.service";
import { RoleService } from "@app/shared/services/role.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
  styleUrls: ["./role-list.component.css"],
})
export class RoleListComponent implements OnInit, OnDestroy {
  showMobilePanel = false;

  rows = [];
  allRoles = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  bsModalRef: BsModalRef;
  searchSubject: Subject<string> = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private roleService: RoleService,
    private modalService: BsModalService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.getRoles();
    this.searchSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((val: string) => {
        if (val) {
          this.rows = this.allRoles.filter((r) =>
            r.name?.toLowerCase().includes(val),
          );
        } else {
          this.rows = [...this.allRoles];
        }
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRoles(): void {
    this.commonService.getRoles().subscribe(
      (res: any) => {
        this.allRoles = res;
        this.rows = res;
        this.cdr.detectChanges();
      },
      (err) => {
        console.error(`Error fetching roles: ${err}`);
      },
    );
  }

  deleteRole(role: Role) {
    this.translate.get("ROLES.DELETE.LABEL").subscribe((translations) => {
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
          this.roleService.deleteRole(role.id).subscribe(() => {
            this.translate
              .get("ROLES.TOAST.ROLE_DELETED_SUCCESSFULLY")
              .subscribe((translatedMessage: string) => {
                this.toastrService.success(translatedMessage);
              });
            this.getRoles();
          });
        }
      });
    });
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

  onSearchChange(event: any) {
    const val = event.target.value.toLowerCase();
    this.searchSubject.next(val);
  }
}
