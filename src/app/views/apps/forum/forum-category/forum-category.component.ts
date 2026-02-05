import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ForumCategoryService } from './forum-category.service';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ManageComponent } from './manage/manage.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forum-category',
  templateUrl: './forum-category.component.html',
  styleUrls: ['./forum-category.component.css']
})
export class ForumCategoryComponent implements OnInit {


  rows: any[] = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  bsModalRef: BsModalRef;

  constructor(
    private forumCategoryService: ForumCategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translateService:TranslateService
  ) { }

  ngOnInit(): void {
    this.getCategories()
  }

  getCategories() {
    this.forumCategoryService.allCategories().subscribe(
      (data: any) => {
        this.rows = data
        this.cdr.markForCheck()
      },
      error => {

      }
    )
  }

  onSelect({ selected }) {
  }

  onActivate(event) {
  }

  manageCategory(data: any) {

    const initialState = {
      data: Object.assign({}, data),
    }

    this.modalService.show(ManageComponent, { initialState: initialState }).onHide.subscribe(() => {
      this.getCategories()
    })
  }

  deleteCategory(data: any) {

    this.translateService.get('CATEGORY.DELETE.LABEL').subscribe((translations) => {
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

      if(result) {
        this.forumCategoryService.deleteCategory(data.id).subscribe((d) => {
          this.translateService.get('CATEGORY.DELETE.TOAST.CATEGORY_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastr.success(translatedMessage); // Display translated message using Toastr
          });
          this.getCategories()
        });
      }

    })
  }

}
