import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ManageComponent } from "./manage/manage.component";
import { BlogCategoryService } from "./blog-category.service";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { Subject, merge } from "rxjs";
import { takeUntil, first } from "rxjs/operators";

@Component({
  selector: "app-blog-category",
  templateUrl: "./blog-category.component.html",
  styleUrls: ["./blog-category.component.css"],
})
export class BlogCategoryComponent implements OnInit, OnDestroy {
  rows: any[] = [];

  ColumnMode = ColumnMode;

  bsModalRef: BsModalRef;
  private destroy$ = new Subject<void>();

  constructor(
    private blogCategoryService: BlogCategoryService,
    private cdr: ChangeDetectorRef,
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
    this.blogCategoryService.allCategories().subscribe(
      (data: any) => {
        this.rows = data;
        this.cdr.markForCheck();
      },
      (error) => {
        console.error("Error fetching categories", error);
      },
    );
  }


  manageCategory(data: any) {
    const initialState = {
      data: Object.assign({}, data),
    };

    this.modalService
      .show(ManageComponent, { initialState })
      .onHide.pipe(first())
      .subscribe(() => {
        this.getCategories();
      });
  }

  deleteCategory(data: any) {
    this.translateService
      .get("CATEGORY.DELETE.LABEL")
      .pipe(first())
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

        merge(
          this.bsModalRef.content.onClose.pipe(first()),
          this.bsModalRef.onHidden.pipe(first())
        ).subscribe((result: any) => {
            if (result === true) {
              this.blogCategoryService
                .deleteCategory(data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                  this.translateService
                    .get("CATEGORY.DELETE.TOAST.CATEGORY_DELETED_SUCCESSFULLY")
                    .pipe(first())
                    .subscribe((translatedMessage: string) => {
                      this.toastr.success(translatedMessage);
                    });
                  this.getCategories();
                });
            }
          });
      });
  }
}
