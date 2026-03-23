import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, of } from "rxjs";
import {
  debounceTime,
  switchMap,
  catchError,
  tap,
  takeUntil,
} from "rxjs/operators";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { BlogService } from "../blog.service";
import { environment } from "src/environments/environment";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { BlogResource } from "@app/shared/enums/blog-resource";
import { BlogCategoryService } from "../blog-category/blog-category.service";

@Component({
  selector: "app-blog-list",
  templateUrl: "./blog-list.component.html",
  styleUrls: ["./blog-list.component.css"],
})
export class BlogListComponent implements OnInit, OnDestroy {
  showMobilePanel = false;

  rows: any[] = [];
  selected = [];
  categories: any[] = [];
  blogResource: BlogResource;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  bsModalRef: BsModalRef;
  searchSubject: Subject<void> = new Subject<void>();
  isLoadingResults = false;
  loadError = false;
  private destroy$ = new Subject<void>();

  constructor(
    private blogsService: BlogService,
    private blogCategoryService: BlogCategoryService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private toastr: ToastrService,
  ) {
    this.blogResource = new BlogResource();
  }

  ngOnInit(): void {
    this.getBlogsCategories();
    this.searchSubject
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoadingResults = true;
          this.loadError = false;
          this.cdr.detectChanges();
        }),
        switchMap(() =>
          this.blogsService.allBlogs(this.blogResource).pipe(
            catchError((err) => {
              this.loadError = true;
              this.isLoadingResults = false;
              this.cdr.markForCheck();
              console.error(err);
              return of([]);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((data: any) => {
        this.rows = data;
        this.isLoadingResults = false;
        this.cdr.markForCheck();
      });
    this.searchSubject.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getHost() {
    return environment.apiUrl;
  }

  getAllBlogs(data = this.blogResource) {
    this.blogResource = data;
    this.searchSubject.next();
  }

  getBlogsCategories() {
    this.blogCategoryService.allCategories().subscribe(
      (data: any) => {
        this.categories = data;
        this.cdr.markForCheck();
      },
      (error) => {},
    );
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  deleteBlog(data: any) {
    this.translateService.get("BLOG.DELETE.LABEL").subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        class: "modal-confirm-custom",
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm,
          },
        },
      });
    });

    this.bsModalRef.content.onClose.subscribe((result) => {
      if (result) {
        this.blogsService.deleteBlog(data.id).subscribe((data: any) => {
          this.translateService
            .get("BLOG.DELETE.TOAST.DELETED_SUCCESSFULLY")
            .subscribe((translatedMessage: string) => {
              this.toastr.success(translatedMessage);
            });
          this.getAllBlogs();
        });
      }
    });
  }

  onActivate(event) {}

  onNameChange(event: any) {
    const val = event.target.value;
    this.blogResource.title = val ? val : "";
    this.blogResource.skip = 0;
    this.searchSubject.next();
  }

  onCategoryChange(event: any) {
    if (event) {
      this.blogResource.category = event;
    } else {
      this.blogResource.category = "";
    }
    this.blogResource.skip = 0;
    this.getAllBlogs(this.blogResource);
  }

  onDateChange(event: any) {
    if (event) {
      this.blogResource.createdAt = new Date(event).toDateString();
    } else {
      this.blogResource.createdAt = "";
    }
    this.blogResource.skip = 0;
    this.getAllBlogs(this.blogResource);
  }
}
