import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SurveyService } from "../survey.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CommonService } from "@app/shared/services/common.service";
import { SecurityService } from "@app/core/security/security.service";
import { User } from "@app/shared/enums/user-auth";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AppFormBase } from "../../shared/app-form-base";

type SurveyType = "simple" | "rating" | "satisfaction";

@Component({
  selector: "app-survey-add",
  templateUrl: "./survey-add.component.html",
  styleUrls: ["./survey-add.component.scss"],
})
export class SurveyAddComponent extends AppFormBase implements OnInit {
  surveyForm: FormGroup;
  allUsers: User[] = [];

  surveyType: readonly SurveyType[] = ["simple", "rating", "satisfaction"];
  surveyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private commonService: CommonService,
    private securityService: SecurityService,
    private toastrService: ToastrService,
    private translate: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentUser = this.securityService.getUserDetail()?.user;
    this.createSurveyForm();
    this.setupPrivateFieldWatcher();
    this.checkEditMode();
  }

  private setupPrivateFieldWatcher(): void {
    this.surveyForm.get("private")?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPrivate: boolean) => {
        const usersControl = this.surveyForm.get("users");
        if (isPrivate) {
          const currentUsers = usersControl?.value || [];
          const currentUserId = this.currentUser?.id;
          if (currentUserId && !currentUsers.includes(currentUserId)) {
            usersControl?.setValue([...currentUsers, currentUserId]);
          }
        } else {
          usersControl?.setValue([]);
        }
      });
  }

  private checkEditMode(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get("id");
        if (id) {
          this.isEdit = true;
          this.surveyId = id;
          this.loadUsers().then(() => {
            this.loadSurvey(id);
          }).catch(() => {
            this.loadSurvey(id);
          });
        } else {
          this.loadUsers().catch(() => {});
        }
      });
  }

  private loadSurvey(id: string): void {
    this.isLoading = true;
    this.surveyService
      .getSurvey(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          const allowedUserIds = data.users || [];
          this.surveyForm.patchValue({
            title: data.title,
            type: data.type,
            forum: data.forum,
            blog: data.blog,
            private: data.privacy === "private",
            users: allowedUserIds,
          });
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.translate
            .get("ADD.SHARED.ERRORS.NETWORK_ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
          this.cdr.markForCheck();
        },
      });
  }

  private loadUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.commonService
        .getUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (users: User[]) => {
            this.allUsers = users;
            this.users = users;
            this.cdr.markForCheck();
            resolve();
          },
          error: () => {
            this.translate
              .get("ADD.SHARED.ERRORS.NETWORK_ERROR")
              .pipe(takeUntil(this.destroy$))
              .subscribe((message) => {
                this.toastrService.error(message);
              });
            reject();
          },
        });
    });
  }

  createSurveyForm() {
    this.surveyForm = this.fb.group({
      title: ["", [Validators.required]],
      type: [null, [Validators.required]],
      users: [[]],
      private: [false],
      blog: [true, [Validators.required]],
      forum: [true, [Validators.required]],
    });
  }

  isSurveyFieldInvalid(fieldName: string): boolean {
    return this.isFieldInvalid(this.surveyForm, fieldName);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
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
      this.updateSurvey(formData);
    } else {
      this.createSurvey(formData);
    }
  }

  private createSurvey(formData: any): void {
    this.surveyService
      .addSurvey(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.translate
            .get("ADD.SURVEY.TOAST.SUCCESS")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.success(message);
            });
          this.router.navigate(["/apps/surveys"]);
        },
        error: () => {
          this.isLoading = false;
          this.translate
            .get("ADD.SURVEY.TOAST.ERROR")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.error(message);
            });
        },
      });
  }

  private updateSurvey(formData: any): void {
    this.surveyService
      .updateSurvey(this.surveyId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.translate
            .get("EDIT.SHARED.TOAST.SUCCESS")
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
              this.toastrService.success(message);
            });
          this.router.navigate(["/apps/surveys"]);
        },
        error: () => {
          this.isLoading = false;
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
    const formValue = this.surveyForm.value;

    let userIds = formValue.users || [];
    if (formValue.private) {
      if (this.currentUser?.id && !userIds.includes(this.currentUser.id)) {
        userIds = [...userIds, this.currentUser.id];
      }
    } else {
      userIds = [];
    }

    return {
      title: formValue.title,
      type: formValue.type,
      forum: formValue.forum,
      blog: formValue.blog,
      privacy: formValue.private ? "private" : "public",
      users: userIds,
    };
  }

  onCancel() {
    this.router.navigate(["/apps/surveys"]);
  }

  get titleControl() {
    return this.surveyForm.get("title");
  }

  get typeControl() {
    return this.surveyForm.get("type");
  }

  get titleErrorMessage(): string {
    const control = this.titleControl;
    if (control?.errors?.["required"]) {
      return "ADD.SURVEY.ERRORS.TITLE_REQUIRED";
    }
    return "";
  }

  get typeErrorMessage(): string {
    const control = this.typeControl;
    if (control?.errors?.["required"]) {
      return "ADD.SURVEY.ERRORS.TYPE_REQUIRED";
    }
    return "";
  }
}
