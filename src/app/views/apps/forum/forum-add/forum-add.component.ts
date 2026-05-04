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
import { SecurityService } from "@app/core/security/security.service";
import { CommonService } from "@app/shared/services/common.service";

@Component({
  selector: "app-forum-add",
  templateUrl: "./forum-add.component.html",
  styleUrls: ["./forum-add.component.scss"],
})
export class ForumAddComponent implements OnInit, OnDestroy {
  forumForm: FormGroup;
  categories: any[] = [];
  users: any[] = [];
  currentUser: any;
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
    private securityService: SecurityService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.securityService.getUserDetail()?.user;
    this.initializeForm();
    this.setupPrivateFieldWatcher();
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
      content: ["", [Validators.required, Validators.minLength(10)]],
      tags: [[]],
      private: [false],
      users: [[]],
    });

    // Removed category change listener for subcategories
  }

  private setupPrivateFieldWatcher(): void {
    this.forumForm.get('private')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPrivate: boolean) => {
        const usersControl = this.forumForm.get('users');
        if (isPrivate) {
          const currentUsers = usersControl?.value || [];
          const currentUserId = this.currentUser?.id;
          // Only add if we have a valid user ID and it's not already in the list
          if (currentUserId && !currentUsers.includes(currentUserId)) {
            usersControl?.setValue([...currentUsers, currentUserId]);
          }
        } else {
          usersControl?.setValue([]);
        }
      });
  }

  private loadUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.commonService
        .getUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            this.users = data;
            this.cdr.markForCheck();
            resolve();
          },
          error: (error) => {
            console.error("Error loading users:", error);
            reject(error);
          },
        });
    });
  }

  private loadCategories(): void {
    this.forumCategoryService
      .allCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.categories = data;

          // Removed subcategory derivation
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
            .get("EDIT.SHARED.TOAST.SUCCESS")
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
            .get("EDIT.SHARED.TOAST.ERROR")
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

    // Process tags - normalize both strings and objects, remove empty ones
    if (formValue.tags && formValue.tags.length > 0) {
      formValue.tags = formValue.tags
        .map((tag) => {
          if (typeof tag === "string") {
            return tag.trim();
          } else if (tag && tag.label) {
            return tag.label.trim();
          } else if (tag && tag.metatag) {
            return tag.metatag.trim();
          }
          return null;
        })
        .filter((tag) => tag && tag.length > 0);
    }

    // Process users - include current user if private
    if (formValue.private) {
      if (formValue.users && formValue.users.length > 0) {
        formValue.users = [...formValue.users, this.currentUser?.id];
      } else {
        formValue.users = [this.currentUser?.id];
      }
    } else {
      // Clear users if not private
      formValue.users = [];
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
          // Load users first, then load the forum so users are available for pre-selection
          this.loadUsers().then(() => {
            this.loadForum(id);
          }).catch(() => {
            this.loadForum(id);
          });
        } else {
          // Not in edit mode, just load users
          this.loadUsers().catch(() => {});
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

          // Map allowedUsers to user IDs that exist in the users array
          // Backend now returns allowedUsers with user relationship
          const allowedUserIds = data.allowedUsers
            ? data.allowedUsers
                .map((u: any) => u.user?.id || u.user_id)
                .filter((id: any) => id != null)
            : [];
          // Filter to only include IDs that exist in our users array
          const validUserIds = allowedUserIds.filter((id: any) =>
            id && this.users.some((u) => u.id === id),
          );

          this.forumForm.patchValue({
            title: data.title,
            category: data.category.id,
            content: data.content,
            closed: data.closed,
            tags: data.tags.map((tag: any) => ({ label: tag.metatag })),
            private: data.privacy === "private",
            users: validUserIds,
          });

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
