import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ForumCategoryService } from "./forum-category.service";
import { Router } from "@angular/router";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ManageComponent } from "./manage/manage.component";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-forum-category",
  templateUrl: "./forum-category.component.html",
  styleUrls: ["./forum-category.component.css"],
})
export class ForumCategoryComponent implements OnInit, OnDestroy {
  rows: any[] = [];
  ColumnMode = ColumnMode;

  bsModalRef: BsModalRef;
  private destroy$ = new Subject<void>();

  constructor(
    private forumCategoryService: ForumCategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCategories() {
    this.forumCategoryService
      .allCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.rows = data;
          this.cdr.markForCheck();
        },
        (error) => {
          console.error("Error loading forum categories:", error);
          this.toastr.error(
            this.translateService.instant("ADD.SHARED.ERRORS.NETWORK_ERROR"),
          );
        },
      );
  }

  manageCategory(data: any) {
    const initialState = {
      data: Object.assign({}, data),
    };

    this.modalService
      .show(ManageComponent, {
        class: "modal-md modal-dialog-centered",
        initialState: initialState,
      })
      .onHide.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCategories();
      });
  }

  deleteCategory(data: any) {
    this.translateService
      .get("CATEGORY.DELETE.LABEL")
      .pipe(takeUntil(this.destroy$))
      .subscribe((translations) => {
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

        this.bsModalRef.content.onClose
          .pipe(takeUntil(this.destroy$))
          .subscribe((result) => {
            if (result) {
              this.forumCategoryService
                .deleteCategory(data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: () => {
                    this.translateService
                      .get(
                        "CATEGORY.DELETE.TOAST.CATEGORY_DELETED_SUCCESSFULLY",
                      )
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((translatedMessage: string) => {
                        this.toastr.success(translatedMessage);
                      });
                    this.getCategories();
                  },
                  error: (err) => {
                    console.error("Error deleting forum category:", err);
                    this.toastr.error(
                      this.translateService.instant(
                        "ADD.SHARED.ERRORS.NETWORK_ERROR",
                      ),
                    );
                  },
                });
            }
          });
      });
  }
}
