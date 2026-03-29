import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { take, debounceTime, switchMap, catchError, tap } from "rxjs/operators";
import { Subject, of } from "rxjs";

import { ForumResource } from "@app/shared/enums/forum-resource";
import { ForumCategoryService } from "../forum-category/forum-category.service";
import { ForumService } from "../forum.service";
import { ForumCommentsModalComponent } from "./forum-comments-modal.component";

@Component({
  selector: "app-forum-list",
  templateUrl: "./forum-list.component.html",
  styleUrls: ["./forum-list.component.css"],
})
export class ForumListComponent implements OnInit {
  showMobilePanel = false;

  rows: any[] = [];
  selected: any[] = [];
  categories: any[] = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  bsModalRef: BsModalRef;
  forumResource: ForumResource;
  searchSubject: Subject<void> = new Subject<void>();
  isLoadingResults = false;

  constructor(
    private forumService: ForumService,
    private forumCategoryService: ForumCategoryService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private toastr: ToastrService,
  ) {
    this.forumResource = new ForumResource();
  }

  ngOnInit(): void {
    this.getForumsCategories();
    this.searchSubject
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoadingResults = true)),
        switchMap(() =>
          this.forumService.allForums(this.forumResource).pipe(
            catchError((err) => {
              console.error(err);
              this.isLoadingResults = false;
              this.translateService
                .get("FORUM.TOAST.ERROR")
                .pipe(take(1))
                .subscribe((msg: string) => this.toastr.error(msg));
              return of([]);
            }),
          ),
        ),
      )
      .subscribe((resp: any) => {
        const list = Array.isArray(resp) ? resp : (resp?.data ?? []);
        this.rows = (list || []).map((r: any) => this.normalizeForumRow(r));
        this.isLoadingResults = false;
        this.cdr.markForCheck();
      });
    this.searchSubject.next();
  }

  private normalizeForumRow(row: any) {
    const reactionsCount =
      row?.reactionsCount ??
      row?.reactions_count ??
      (Array.isArray(row?.reactions) ? row.reactions.length : null) ??
      (Array.isArray(row?.reactionsUp) ? row.reactionsUp.length : 0) +
        (Array.isArray(row?.reactionsDown) ? row.reactionsDown.length : 0) +
        (Array.isArray(row?.reactionsHeart) ? row.reactionsHeart.length : 0);

    const commentsCount =
      row?.commentsCount ??
      row?.comments_count ??
      (Array.isArray(row?.comments) ? row.comments.length : 0);

    return {
      ...row,
      reactionsCount: reactionsCount ?? 0,
      commentsCount: commentsCount ?? 0,
    };
  }

  getAllForums(data = this.forumResource) {
    this.forumResource = data;
    this.searchSubject.next();
  }

  getForumsCategories() {
    this.forumCategoryService.allCategories().subscribe((data: any) => {
      this.categories = data;
      this.cdr.markForCheck();
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {}

  openCommentsModal(row: any) {
    if (!row?.id) return;

    this.bsModalRef = this.modalService.show(ForumCommentsModalComponent, {
      class: "modal-lg modal-dialog-centered",
      initialState: {
        forumId: row.id,
        forumTitle: row.title,
        onCommentsChanged: () => this.getAllForums(this.forumResource),
      },
    });
  }

  deleteForum(row: any) {
    this.translateService
      .get("FORUM.DELETE.LABEL")
      .pipe(take(1))
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

        this.bsModalRef.content.onClose.pipe(take(1)).subscribe((result) => {
          if (result) {
            this.forumService
              .deleteForum(row.id)
              .pipe(take(1))
              .subscribe(
                () => {
                  this.translateService
                    .get("FORUM.DELETE.TOAST.DELETED_SUCCESSFULLY")
                    .pipe(take(1))
                    .subscribe((translatedMessage: string) =>
                      this.toastr.success(translatedMessage),
                    );
                  this.getAllForums(this.forumResource);
                },
                () => {
                  this.translateService
                    .get("FORUM.DELETE.TOAST.DELETED_ERROR")
                    .pipe(take(1))
                    .subscribe((translatedMessage: string) =>
                      this.toastr.error(translatedMessage),
                    );
                },
              );
          }
        });
      });
  }

  onNameChange(event: any) {
    const val = event.target.value;
    this.forumResource.title = val ? val : "";
    this.forumResource.skip = 0;
    this.searchSubject.next();
  }

  onCategoryChange(event: any) {
    this.forumResource.category = event ? event : "";
    this.forumResource.skip = 0;
    this.searchSubject.next();
  }

  onDateChange(event: any) {
    this.forumResource.createdAt = event ? new Date(event).toDateString() : "";
    this.forumResource.skip = 0;
    this.searchSubject.next();
  }
}
