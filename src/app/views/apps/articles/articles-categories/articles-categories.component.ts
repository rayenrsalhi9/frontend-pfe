import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ArticleCategoryService } from "@app/shared/services/article-category.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ArticlesCategoryAddComponent } from "../articles-category-add/articles-category-add.component";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: "app-articles-categories",
  templateUrl: "./articles-categories.component.html",
  styleUrls: ["./articles-categories.component.css"],
})
export class ArticlesCategoriesComponent implements OnInit {
  showMobilePanel = false;

  rows: any[] = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  bsModalRef: BsModalRef;

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

  getCategories() {
    this.articleCategoryService.allCategories().subscribe(
      (data: any) => {
        this.rows = data;
        this.cdr.markForCheck();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  manageCategory(data: any) {
    const initialState = {
      width: "350px",
      data: Object.assign({}, data),
    };

    this.modalService
      .show(ArticlesCategoryAddComponent, { initialState: initialState })
      .onHide.subscribe(() => {
        this.getCategories();
      });
  }

  deleteCategory(id: any) {
    this.translate.get("CATEGORY.DELETE.LABEL").subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: translations.TITLE,
          message: translations.MESSAGE,
          button: {
            cancel: translations.BUTTON.CANCEL,
            confirm: translations.BUTTON.CONFIRM,
          },
        },
      });
    });
    this.bsModalRef.content.onClose.subscribe((result) => {
      if (result) {
        this.articleCategoryService.deleteCategory(id).subscribe((d) => {
          this.translate
            .get("CATEGORY.DELETE.TOAST.CATEGORY_DELETED_SUCCESSFULLY")
            .subscribe((translatedMessage: string) => {
              this.toastr.success(translatedMessage);
            });
          this.getCategories();
        });
      }
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {}
}
