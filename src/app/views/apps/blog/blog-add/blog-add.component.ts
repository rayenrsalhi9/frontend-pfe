import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeUrl, SafeHtml } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BlogService } from "../blog.service";
import { BlogCategoryService } from "../blog-category/blog-category.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-blog-add",
  templateUrl: "./blog-add.component.html",
  styleUrls: ["./blog-add.component.scss"],
})
export class BlogAddComponent implements OnInit, OnDestroy {
  blogForm: FormGroup;
  picture: SafeUrl;
  newPicture: SafeUrl;
  minDate = new Date();
  categories: any[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private blogService: BlogService,
    private router: Router,
    private blogCategoryService: BlogCategoryService,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.blogForm = this.fb.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      subtitle: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(300),
        ],
      ],
      body: ["", [Validators.required, Validators.minLength(50)]],
      category: ["", [Validators.required]],
      private: [false],
      tags: [[]],
      users: [[]],
      expiration: [false],
      banner: [false],
      startDate: [""],
      endDate: [""],
      picture: ["", [Validators.required]],
    });

    // Add date validation when expiration is enabled
    this.blogForm
      .get("expiration")
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((enabled) => {
        const startDateControl = this.blogForm.get("startDate");
        const endDateControl = this.blogForm.get("endDate");

        if (enabled) {
          startDateControl?.setValidators([Validators.required]);
          endDateControl?.setValidators([Validators.required]);
        } else {
          startDateControl?.clearValidators();
          endDateControl?.clearValidators();
          startDateControl?.setValue("");
          endDateControl?.setValue("");
        }

        startDateControl?.updateValueAndValidity();
        endDateControl?.updateValueAndValidity();
      });
  }

  private loadCategories(): void {
    this.blogCategoryService
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

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const mimeType = file.type;

    // Validate file type
    if (!mimeType.match(/image\/*/)) {
      this.translate
        .get("ADD.BLOG.ERRORS.IMAGE_INVALID")
        .pipe(takeUntil(this.destroy$))
        .subscribe((message) => {
          this.toastrService.error(message);
        });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.translate
        .get("ADD.BLOG.VALIDATION.IMAGE_TOO_LARGE")
        .pipe(takeUntil(this.destroy$))
        .subscribe((message) => {
          this.toastrService.error(message);
        });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      if (result) {
        this.newPicture = this.sanitizer.bypassSecurityTrustUrl(result);
        this.blogForm.patchValue({ picture: result });
        this.cdr.detectChanges();
      }
    };
    reader.readAsDataURL(file);
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.sanitize(1, content) || "";
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      this.translate
        .get("ADD.SHARED.ERRORS.VALIDATION_ERROR")
        .pipe(takeUntil(this.destroy$))
        .subscribe((message) => {
          this.toastrService.warning(message);
        });
      return;
    }

    // Validate date range if expiration is enabled
    if (this.blogForm.get("expiration")?.value) {
      const startDate = this.blogForm.get("startDate")?.value;
      const endDate = this.blogForm.get("endDate")?.value;

      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        this.translate
          .get("ADD.BLOG.ERRORS.DATE_INVALID")
          .pipe(takeUntil(this.destroy$))
          .subscribe((message) => {
            this.toastrService.error(message);
          });
        return;
      }
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    this.blogService
      .addBlog(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.translate
            .get("ADD.BLOG.TOAST.SUCCESS")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.success(message);
            });
          this.router.navigate(["/apps/blogs"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error creating blog:", error);
          this.translate
            .get("ADD.BLOG.TOAST.ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  private prepareFormData(): any {
    const formValue = this.blogForm.value;

    // Sanitize content
    if (formValue.body) {
      formValue.body = this.sanitizeContent(formValue.body);
    }

    // Process tags
    if (formValue.tags && formValue.tags.length > 0) {
      formValue.tags = formValue.tags
        .map((tag) => (typeof tag === "string" ? tag.trim() : tag))
        .filter((tag) => tag && tag.length > 0);
    }

    // Process users
    if (formValue.users && formValue.users.length > 0) {
      formValue.users = formValue.users.filter(
        (user) => user && user.length > 0,
      );
    }

    return formValue;
  }

  onCancel(): void {
    this.router.navigate(["/apps/blogs"]);
  }

  // Getters for form controls
  get titleControl() {
    return this.blogForm.get("title");
  }

  get subtitleControl() {
    return this.blogForm.get("subtitle");
  }

  get bodyControl() {
    return this.blogForm.get("body");
  }

  get categoryControl() {
    return this.blogForm.get("category");
  }

  get pictureControl() {
    return this.blogForm.get("picture");
  }

  get startDateControl() {
    return this.blogForm.get("startDate");
  }

  get endDateControl() {
    return this.blogForm.get("endDate");
  }

  // Validation getters
  get isTitleInvalid(): boolean {
    const control = this.titleControl;
    return !!(control && control.invalid && control.dirty);
  }

  get isSubtitleInvalid(): boolean {
    const control = this.subtitleControl;
    return !!(control && control.invalid && control.dirty);
  }

  get isBodyInvalid(): boolean {
    const control = this.bodyControl;
    return !!(control && control.invalid && control.dirty);
  }

  get isCategoryInvalid(): boolean {
    const control = this.categoryControl;
    return !!(control && control.invalid && control.dirty);
  }

  get isPictureInvalid(): boolean {
    const control = this.pictureControl;
    return !!(control && control.invalid && control.dirty);
  }

  get isStartDateInvalid(): boolean {
    const control = this.startDateControl;
    return !!(control && control.invalid && control.dirty);
  }

  get isEndDateInvalid(): boolean {
    const control = this.endDateControl;
    return !!(control && control.invalid && control.dirty);
  }

  // Error message getters
  get titleErrorMessage(): string {
    const control = this.titleControl;
    if (control?.errors?.["required"]) {
      return "ADD.BLOG.ERRORS.TITLE_REQUIRED";
    }
    if (control?.errors?.["minlength"]) {
      return "ADD.BLOG.VALIDATION.TITLE_MIN_LENGTH";
    }
    if (control?.errors?.["maxlength"]) {
      return "ADD.BLOG.VALIDATION.TITLE_MAX_LENGTH";
    }
    return "";
  }

  get subtitleErrorMessage(): string {
    const control = this.subtitleControl;
    if (control?.errors?.["required"]) {
      return "ADD.BLOG.ERRORS.SUBTITLE_REQUIRED";
    }
    if (control?.errors?.["minlength"]) {
      return "ADD.BLOG.VALIDATION.SUBTITLE_MIN_LENGTH";
    }
    if (control?.errors?.["maxlength"]) {
      return "ADD.BLOG.VALIDATION.SUBTITLE_MAX_LENGTH";
    }
    return "";
  }

  get bodyErrorMessage(): string {
    const control = this.bodyControl;
    if (control?.errors?.["required"]) {
      return "ADD.BLOG.ERRORS.BODY_REQUIRED";
    }
    if (control?.errors?.["minlength"]) {
      return "ADD.BLOG.VALIDATION.BODY_MIN_LENGTH";
    }
    return "";
  }

  get categoryErrorMessage(): string {
    const control = this.categoryControl;
    if (control?.errors?.["required"]) {
      return "ADD.BLOG.ERRORS.CATEGORY_REQUIRED";
    }
    return "";
  }

  get pictureErrorMessage(): string {
    const control = this.pictureControl;
    if (control?.errors?.["required"]) {
      return "ADD.BLOG.ERRORS.PICTURE_REQUIRED";
    }
    return "";
  }
}
