import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticleResource } from '@app/shared/enums/article-resource';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BlogService } from '../../blog/blog.service';
import { ForumService } from '../forum.service';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DocumentResource } from '@app/shared/enums/document-resource';
import { ForumResource } from '@app/shared/enums/forum-resource';
import { ForumCategoryService } from '../forum-category/forum-category.service';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css']
})
export class ForumListComponent implements OnInit {

  showMobilePanel = false

  rows: any[] = [];
  selected = [];
  categories:any[] =[];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  bsModalRef: BsModalRef;
  forumResource:ForumResource

  constructor(
    private forumService:ForumService,
    private forumCategoryService: ForumCategoryService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private toastr: ToastrService,
  ) {
    this.forumResource = new ForumResource();
   }

  ngOnInit(): void {
    this.getAllForums()
    this.getForumsCategories()
  }

  getAllForums (data = this.forumResource) {
    this.forumService.allForums(data).subscribe(
      (data:any)=>{
        console.log(data);
        this.rows = data
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  getForumsCategories() {
    this.forumCategoryService.allCategories().subscribe(
      (data:any)=>{
        this.categories = data
        this.cdr.markForCheck()
      },
      error=>{

      }
    )
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
  }

  deleteForum(data:any) {

    this.translateService.get('FORUM.DELETE.LABEL').subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
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
        this.forumService.deleteForum(data.id).subscribe(
          (data: any) => {
            this.translateService.get('FORUM.DELETE.TOAST.DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {this.toastr.success(translatedMessage); });
            this.getAllForums()
          }
        )

      }
    })
  }

  onNameChange(event: any) {
    let val = event.target.value
    if (val) {
      this.forumResource.title = val;
    } else {
      this.forumResource.title = '';
    }
    this.forumResource.skip = 0;
    this.getAllForums(this.forumResource);
  }

  onCategoryChange(event: any) {
    if (event) {
      this.forumResource.category = event;
    } else {
      this.forumResource.category = '';
    }
    this.forumResource.skip = 0;
    this.getAllForums(this.forumResource);
  }

  onDateChange(event: any) {
    if (event) {
      this.forumResource.createdAt = new Date(event).toDateString();
    } else {
      this.forumResource.createdAt = '';
    }
    this.forumResource.skip = 0;
    this.getAllForums(this.forumResource);
  }

}
