import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  SecurityContext,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BlogService } from "../blog.service";
import { BlogCategoryService } from "../blog-category/blog-category.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { CommonService } from "src/app/shared/services/common.service";
import { SecurityService } from "@app/core/security/security.service";

// Custom date range validator
export const dateRangeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const expiration = control.get("expiration")?.value;
  if (!expiration) {
    return null; // No validation needed if expiration is disabled
  }

  const startDate = control.get("startDate")?.value;
  const endDate = control.get("endDate")?.value;

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    return { dateInvalid: true };
  }

  return null;
};

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
  users: any[] = [];
  currentUser: any;
  isLoading = false;
  isEdit = false;
  blogId: any;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private blogService: BlogService,
    private router: Router,
    private blogCategoryService: BlogCategoryService,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private commonService: CommonService,
    private securityService: SecurityService,
    private sanitizer: DomSanitizer,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.securityService.getUserDetail().user;
    this.initializeForm();
    this.loadCategories();
    this.loadUsers();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.blogForm = this.fb.group(
      {
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
      },
      { validators: dateRangeValidator },
    );

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

  private loadUsers(): void {
    this.commonService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.users = data.filter((user: any) => user.id !== this.currentUser.id);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error("Error loading users:", error);
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
    if (!mimeType.startsWith("image/")) {
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

  private sanitizeContent(content: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, content) || "";
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

    this.isLoading = true;
    const formData = this.prepareFormData();

    if (this.isEdit) {
      this.updateBlog(formData);
    } else {
      this.createBlog(formData);
    }
  }

  private createBlog(formData: any): void {
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

  private updateBlog(formData: any): void {
    this.blogService
      .updateBlog(this.blogId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.translate
            .get("EDIT.BLOG.TOAST.SUCCESS")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.success(message);
            });
          this.router.navigate(["/apps/blogs"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error updating blog:", error);
          this.translate
            .get("EDIT.BLOG.TOAST.ERROR")
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
        .filter((tag) => {
          if (typeof tag === "string") {
            return tag.trim().length > 0;
          }
          // Keep valid objects (assuming they represent valid tag objects)
          return tag && typeof tag === "object";
        });
    }

    // Process users
    if (formValue.users && formValue.users.length > 0) {
      formValue.users = formValue.users.filter((user) => {
        if (typeof user === "string") {
          return user.length > 0;
        }
        if (typeof user === "number") {
          return true; // Numeric IDs are valid
        }
        // Keep valid objects (assuming they represent valid user objects)
        return user && typeof user === "object";
      });
    }

    return formValue;
  }

  onCancel(): void {
    this.router.navigate(["/apps/blogs"]);
  }

  private checkEditMode(): void {
    this.activeRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get("id");
        if (id) {
          this.isEdit = true;
          this.blogId = id;
          this.loadBlog(id);
        }
      });
  }

  private loadBlog(id: string): void {
    this.isLoading = true;
    this.blogService
      .getBlog(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.blogForm.patchValue({
            title: data.title,
            subtitle: data.subtitle,
            category: data.category.id,
            banner: data.banner,
            expiration: data.expiration,
            startDate: data.startDate
              ? new Date(data.startDate).toISOString().slice(0, 10)
              : null,
            endDate: data.endDate
              ? new Date(data.endDate).toISOString().slice(0, 10)
              : null,
            body: data.body,
            tags: data.tags.map((tag: any) => ({ label: tag.metatag })),
            private: data.privacy === "private",
            picture: null,
          });

          this.picture = data.picture
            ? data.picture.startsWith("data:image")
              ? data.picture
              : this.getHost() + data.picture
            : null;
          this.newPicture = this.picture; // Set newPicture for template preview

          // Remove required validator for picture in edit mode since we already have an image
          if (this.picture) {
            this.blogForm.get("picture")?.clearValidators();
            this.blogForm.get("picture")?.updateValueAndValidity();
          }

          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error loading blog:", error);
          this.translate
            .get("ADD.SHARED.ERRORS.NETWORK_ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  private getHost(): string {
    return environment.apiUrl || "http://localhost:3000/";
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
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isSubtitleInvalid(): boolean {
    const control = this.subtitleControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isBodyInvalid(): boolean {
    const control = this.bodyControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isCategoryInvalid(): boolean {
    const control = this.categoryControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isPictureInvalid(): boolean {
    const control = this.pictureControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isDateInvalid(): boolean {
    return !!this.blogForm.errors?.["dateInvalid"];
  }

  get isStartDateInvalid(): boolean {
    const control = this.startDateControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isEndDateInvalid(): boolean {
    const control = this.endDateControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
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
