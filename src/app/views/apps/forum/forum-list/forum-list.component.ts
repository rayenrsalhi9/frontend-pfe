import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { ForumResource } from '@app/shared/enums/forum-resource';
import { ForumCategoryService } from '../forum-category/forum-category.service';
import { ForumService } from '../forum.service';
import { ForumCommentsModalComponent } from './forum-comments-modal.component';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css']
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
    this.getAllForums();
    this.getForumsCategories();
  }

  private normalizeForumRow(row: any) {
    const reactionsCount =
      row?.reactionsCount ??
      row?.reactions_count ??
      (Array.isArray(row?.reactions) ? row.reactions.length : null) ??
      (
        (Array.isArray(row?.reactionsUp) ? row.reactionsUp.length : 0) +
        (Array.isArray(row?.reactionsDown) ? row.reactionsDown.length : 0) +
        (Array.isArray(row?.reactionsHeart) ? row.reactionsHeart.length : 0)
      );

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
    this.forumService.allForums(data).subscribe((resp: any) => {
      const list = Array.isArray(resp) ? resp : (resp?.data ?? []);
      this.rows = (list || []).map((r: any) => this.normalizeForumRow(r));
      this.cdr.markForCheck();
    });
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
      class: 'modal-lg',
      initialState: {
        forumId: row.id,
        forumTitle: row.title,
        onCommentsChanged: () => this.getAllForums(this.forumResource),
      }
    });
  }

  deleteForum(row: any) {
    this.translateService.get('FORUM.DELETE.LABEL').subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        class: 'modal-confirm-custom',
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm
          }
        }
      });
    });

    this.bsModalRef.content.onClose.subscribe(result => {
      if (result) {
        this.forumService.deleteForum(row.id).subscribe(() => {
          this.translateService.get('FORUM.DELETE.TOAST.DELETED_SUCCESSFULLY')
            .subscribe((translatedMessage: string) => this.toastr.success(translatedMessage));
          this.getAllForums(this.forumResource);
        });
      }
    });
  }

  onNameChange(event: any) {
    const val = event.target.value;
    this.forumResource.title = val ? val : '';
    this.forumResource.skip = 0;
    this.getAllForums(this.forumResource);
  }

  onCategoryChange(event: any) {
    this.forumResource.category = event ? event : '';
    this.forumResource.skip = 0;
    this.getAllForums(this.forumResource);
  }

  onDateChange(event: any) {
    this.forumResource.createdAt = event ? new Date(event).toDateString() : '';
    this.forumResource.skip = 0;
    this.getAllForums(this.forumResource);
  }
}
