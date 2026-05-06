import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  SecurityContext,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ArticleCategoryService } from "@app/shared/services/article-category.service";
import { ArticleService } from "@app/shared/services/article.service";
import { CommonService } from "@app/shared/services/common.service";
import { SecurityService } from "@app/core/security/security.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { AppFormBase } from "../../shared/app-form-base";

@Component({
  selector: "app-articles-add",
  templateUrl: "./articles-add.component.html",
  styleUrls: ["./articles-add.component.scss"],
})
export class ArticlesAddComponent extends AppFormBase implements OnInit {
  articleForm: FormGroup;
  picture: SafeUrl;
  newPicture: string = null;
  fileList: any[] = [];

  private fb: FormBuilder;


  constructor(
    fb: FormBuilder,
    private commonService: CommonService,
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
  ) {
    super();
    this.fb = fb;
  }

  ngOnInit(): void {
    this.currentUser = this.securityService.getUserDetail().user;
    this.initializeForm();
    this.loadCategories();
    this.loadUsers();
    this.checkEditMode();
  }



  private initializeForm(): void {
    this.articleForm = this.fb.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      category: ["", [Validators.required]],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ],
      body: ["", [Validators.required, Validators.minLength(50)]],
      private: [false],
      users: [[]],
      picture: ["", [Validators.required]],
    });
  }

  private checkEditMode(): void {
    this.activeRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get("id");
        if (id) {
          this.isEdit = true;
          this.articleId = id;
          this.loadArticle(id);
        }
      });
  }

  private loadArticle(id: string): void {
    this.isLoading = true;
    this.articleService
      .getArticle(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.articleForm.patchValue({
            title: data.title,
            category: data.category.id,
            description: data.shortText,
            body: data.longText,
            private: data.privacy === "private",
            users: data.users
              .filter((usr: any) => usr.user.id !== this.currentUser.id)
              .map((usr: any) => usr.user.id),
          });

          this.picture = data.picture
            ? data.picture.startsWith("data:image")
              ? data.picture
              : this.getHost() + data.picture
            : null;

          // Remove required validator for picture in edit mode since we already have an image
          if (this.picture) {
            this.articleForm.get("picture")?.clearValidators();
            this.articleForm.get("picture")?.updateValueAndValidity();
          }

          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error loading article:", error);
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
          this.users = data;
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

  private loadCategories(): void {
    this.articleCategoryService
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

  getHost(): string {
    return environment.apiUrl || "http://localhost:3000/";
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
        .get("ADD.ARTICLE.ERRORS.IMAGE_INVALID")
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
        .get("ADD.ARTICLE.VALIDATION.IMAGE_TOO_LARGE")
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
        this.newPicture = result;
        this.picture = this.sanitizer.bypassSecurityTrustUrl(result);
        this.articleForm.patchValue({ picture: result });
        this.articleForm.get("picture")?.markAsDirty();
        this.articleForm.get("picture")?.updateValueAndValidity();
        this.cdr.detectChanges();
      }
    };
    reader.readAsDataURL(file);
  }

  private sanitizeContent(content: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, content) || "";
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
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
      this.updateArticle(formData);
    } else {
      this.createArticle(formData);
    }
  }

  private createArticle(formData: any): void {
    this.articleService
      .addArticle(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.translate
            .get("ADD.ARTICLE.TOAST.SUCCESS")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.success(message);
            });
          this.router.navigate(["/apps/articles"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error creating article:", error);
          this.translate
            .get("ADD.ARTICLE.TOAST.ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  private updateArticle(formData: any): void {
    this.articleService
      .updateArticle(this.articleId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.translate
            .get("EDIT.SHARED.TOAST.SUCCESS")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.success(message);
            });
          this.router.navigate(["/apps/articles"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error updating article:", error);
          this.translate
            .get("EDIT.SHARED.TOAST.ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  private prepareFormData(): any {
    const formValue = this.articleForm.value;

    // Sanitize content
    if (formValue.body) {
      formValue.body = this.sanitizeContent(formValue.body);
    }

    if (formValue.description) {
      formValue.description = this.sanitizeContent(formValue.description);
    }

    // Process users - include current user
    let userIds = formValue.users || [];
    if (this.currentUser?.id && !userIds.includes(this.currentUser.id)) {
      userIds = [...userIds, this.currentUser.id];
    }
    formValue.users = userIds;

    return formValue;
  }

  onCancel(): void {
    this.router.navigate(["/apps/articles"]);
  }

  // Getters for form controls
  get titleControl() {
    return this.articleForm.get("title");
  }

  get categoryControl() {
    return this.articleForm.get("category");
  }

  get descriptionControl() {
    return this.articleForm.get("description");
  }

  get bodyControl() {
    return this.articleForm.get("body");
  }

  get pictureControl() {
    return this.articleForm.get("picture");
  }

  // Validation wrapper
  isArticleFieldInvalid(fieldName: string): boolean {
    return this.isFieldInvalid(this.articleForm, fieldName);
  }
}

