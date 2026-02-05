import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BlogService } from '../blog.service';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BlogResource } from '@app/shared/enums/blog-resource';
import { BlogCategoryService } from '../blog-category/blog-category.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  showMobilePanel = false

  rows: any[] = [];
  selected = [];
  categories:any[] =[];
  blogResource: BlogResource;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  bsModalRef: BsModalRef;

  constructor(
    private blogsService:BlogService,
    private blogCategoryService: BlogCategoryService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private toastr: ToastrService,
  ) {
    this.blogResource = new BlogResource();
   }

  ngOnInit(): void {
    this.getAllBlogs()
    this.getBlogsCategories()
  }

  getHost() {
    return environment.apiUrl
  }

  getAllBlogs (data = this.blogResource) {
    this.blogsService.allBlogs(data).subscribe(
      (data:any)=>{
        console.log(data);
        this.rows = data
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  getBlogsCategories() {
    this.blogCategoryService.allCategories().subscribe(
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

  deleteBlog(data:any) {

    this.translateService.get('BLOG.DELETE.LABEL').subscribe((translations) => {
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
        this.blogsService.deleteBlog(data.id).subscribe(
          (data: any) => {
            this.translateService.get('BLOG.DELETE.TOAST.DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {this.toastr.success(translatedMessage); });
            this.getAllBlogs()
          }
        )

      }
    })
  }

  onActivate(event) {
  }

  onNameChange(event: any) {
    let val = event.target.value
    if (val) {
      this.blogResource.title = val;
    } else {
      this.blogResource.title = '';
    }
    this.blogResource.skip = 0;
    this.getAllBlogs(this.blogResource);
  }

  onCategoryChange(event: any) {
    if (event) {
      this.blogResource.category = event;
    } else {
      this.blogResource.category = '';
    }
    this.blogResource.skip = 0;
    this.getAllBlogs(this.blogResource);
  }

  onDateChange(event: any) {
    if (event) {
      this.blogResource.createdAt = new Date(event).toDateString();
    } else {
      this.blogResource.createdAt = '';
    }
    this.blogResource.skip = 0;
    this.getAllBlogs(this.blogResource);
  }

}
