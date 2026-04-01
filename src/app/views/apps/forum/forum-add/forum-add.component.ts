import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  SecurityContext,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ForumService } from "../forum.service";
import { ForumCategoryService } from "../forum-category/forum-category.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-forum-add",
  templateUrl: "./forum-add.component.html",
  styleUrls: ["./forum-add.component.scss"],
})
export class ForumAddComponent implements OnInit, OnDestroy {
  forumForm: FormGroup;
  categories: any[] = [];
  subCategories: any[] = [];
  isLoading = false;
  isEdit = false;
  forumId: any;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private forumService: ForumService,
    private router: Router,
    private forumCategoryService: ForumCategoryService,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.forumForm = this.fb.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      category: ["", [Validators.required]],
      subCategory: [""],
      content: ["", [Validators.required, Validators.minLength(10)]],
      tags: [[]],
      private: [false],
    });

    // Subscribe to category changes to load subcategories
    this.forumForm
      .get("category")!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((categoryId) => {
        this.onCategoryChange(categoryId);
      });
  }

  private onCategoryChange(categoryId: string): void {
    // Reset subCategory when category changes
    this.forumForm.get("subCategory")!.reset();

    // Load subcategories for the selected category
    if (categoryId) {
      const selectedCategory = this.categories.find(
        (cat) => cat.id === categoryId,
      );
      this.subCategories = selectedCategory?.subCategories || [];
    } else {
      this.subCategories = [];
    }

    this.cdr.markForCheck();
  }

  private loadCategories(): void {
    this.forumCategoryService
      .allCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.categories = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error("Error loading categories:", error);
          this.translate
            .get("ADD.SHARED.ERRORS.NETWORK_ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  private sanitizeContent(content: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, content) || "";
  }

  onSubmit(): void {
    if (this.forumForm.invalid) {
      this.forumForm.markAllAsTouched();
      this.translate
        .get("ADD.SHARED.ERRORS.VALIDATION_ERROR")
        .pipe(takeUntil(this.destroy$))
        .subscribe((message) => {
          this.toastrService.warning(message);
        });
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    if (this.isEdit) {
      this.updateForum(formData);
    } else {
      this.createForum(formData);
    }
  }

  private createForum(formData: any): void {
    this.forumService
      .addForum(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.translate
            .get("ADD.FORUM.TOAST.SUCCESS")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.success(message);
            });
          this.router.navigate(["/apps/forums"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error creating forum:", error);
          this.translate
            .get("ADD.FORUM.TOAST.ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  private updateForum(formData: any): void {
    this.forumService
      .updateForum(this.forumId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.translate
            .get("EDIT.FORUM.TOAST.SUCCESS")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.success(message);
            });
          this.router.navigate(["/apps/forums"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error updating forum:", error);
          this.translate
            .get("EDIT.FORUM.TOAST.ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  private prepareFormData(): any {
    const formValue = this.forumForm.value;

    // Sanitize content
    if (formValue.content) {
      formValue.content = this.sanitizeContent(formValue.content);
    }

    // Process tags - ensure they're strings and remove empty ones
    if (formValue.tags && formValue.tags.length > 0) {
      formValue.tags = formValue.tags
        .map((tag) => (typeof tag === "string" ? tag.trim() : tag))
        .filter((tag) => tag && tag.length > 0);
    }

    return formValue;
  }

  onCancel(): void {
    this.router.navigate(["/apps/forums"]);
  }

  private checkEditMode(): void {
    this.activeRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get("id");
        if (id) {
          this.isEdit = true;
          this.forumId = id;
          this.loadForum(id);
        }
      });
  }

  private loadForum(id: string): void {
    this.isLoading = true;
    this.forumService
      .getForum(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.forumForm.patchValue({
            title: data.title,
            category: data.category.id,
            content: data.content,
            closed: data.closed,
            tags: data.tags.map((tag: any) => ({ label: tag.metatag })),
            private: data.privacy === "private",
          });

          // Load subcategories for the selected category
          const selectedCategory = this.categories.find(
            (cat) => cat.id === data.category.id,
          );
          this.subCategories = selectedCategory?.subCategories || [];

          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error loading forum:", error);
          this.translate
            .get("ADD.SHARED.ERRORS.NETWORK_ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  get titleControl() {
    return this.forumForm.get("title");
  }

  get categoryControl() {
    return this.forumForm.get("category");
  }

  get contentControl() {
    return this.forumForm.get("content");
  }

  get isTitleInvalid(): boolean {
    const control = this.titleControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isCategoryInvalid(): boolean {
    const control = this.categoryControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isContentInvalid(): boolean {
    const control = this.contentControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get titleErrorMessage(): string {
    const control = this.titleControl;
    if (control?.errors?.["required"]) {
      return "ADD.FORUM.ERRORS.TITLE_REQUIRED";
    }
    if (control?.errors?.["minlength"]) {
      return "ADD.FORUM.VALIDATION.TITLE_MIN_LENGTH";
    }
    if (control?.errors?.["maxlength"]) {
      return "ADD.FORUM.VALIDATION.TITLE_MAX_LENGTH";
    }
    return "";
  }

  get categoryErrorMessage(): string {
    const control = this.categoryControl;
    if (control?.errors?.["required"]) {
      return "ADD.FORUM.ERRORS.CATEGORY_REQUIRED";
    }
    return "";
  }

  get contentErrorMessage(): string {
    const control = this.contentControl;
    if (control?.errors?.["required"]) {
      return "ADD.FORUM.ERRORS.CONTENT_REQUIRED";
    }
    if (control?.errors?.["minlength"]) {
      return "ADD.FORUM.VALIDATION.CONTENT_MIN_LENGTH";
    }
    return "";
  }
}
