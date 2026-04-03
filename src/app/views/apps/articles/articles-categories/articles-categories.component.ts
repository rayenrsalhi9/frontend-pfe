import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  ArticleCategoryService,
  CategoryDto,
} from "@app/shared/services/article-category.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ArticlesCategoryAddComponent } from "../articles-category-add/articles-category-add.component";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: "app-articles-categories",
  templateUrl: "./articles-categories.component.html",
  styleUrls: ["./articles-categories.component.css"],
})
export class ArticlesCategoriesComponent implements OnInit, OnDestroy {
  showMobilePanel = false;

  rows: CategoryDto[] = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  bsModalRef: BsModalRef;
  private destroy$ = new Subject<void>();

  constructor(
    private articleCategoryService: ArticleCategoryService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCategories() {
    this.articleCategoryService
      .allCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: CategoryDto[]) => {
          this.rows = data;
          this.cdr.markForCheck();
        },
        (error) => {
          console.error(error);
        },
      );
  }

  manageCategory(data: CategoryDto) {
    const initialState = {
      data: Object.assign({}, data),
    };

    this.modalService
      .show(ArticlesCategoryAddComponent, {
        class: "modal-md modal-dialog-centered",
        initialState: initialState,
      })
      .onHide.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCategories();
      });
  }

  deleteCategory(id: number) {
    this.translate
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
              this.articleCategoryService
                .deleteCategory(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((d) => {
                  this.translate
                    .get("CATEGORY.DELETE.TOAST.CATEGORY_DELETED_SUCCESSFULLY")
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((translatedMessage: string) => {
                      this.toastr.success(translatedMessage);
                    });
                  this.getCategories();
                });
            }
          });
      });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {}
}
