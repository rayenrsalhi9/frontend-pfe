import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ForumCategoryService } from "./forum-category.service";
import { Router } from "@angular/router";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ManageComponent } from "./manage/manage.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-forum-category",
  templateUrl: "./forum-category.component.html",
  styleUrls: ["./forum-category.component.css"],
})
export class ForumCategoryComponent implements OnInit {
  rows: any[] = [];
  ColumnMode = ColumnMode;

  bsModalRef: BsModalRef;

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

  getCategories() {
    this.forumCategoryService.allCategories().subscribe(
      (data: any) => {
        this.rows = data;
        this.cdr.markForCheck();
      },
      (error) => {},
    );
  }

  manageCategory(data: any) {
    const initialState = {
      data: Object.assign({}, data),
    };

    this.modalService
      .show(ManageComponent, { initialState: initialState })
      .onHide.subscribe(() => {
        this.getCategories();
      });
  }

  deleteCategory(data: any) {
    this.translateService
      .get("CATEGORY.DELETE.LABEL")
      .subscribe((translations) => {
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

        this.bsModalRef.content.onClose.subscribe((result) => {
          if (result) {
            this.forumCategoryService.deleteCategory(data.id).subscribe((d) => {
              this.translateService
                .get("CATEGORY.DELETE.TOAST.CATEGORY_DELETED_SUCCESSFULLY")
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
