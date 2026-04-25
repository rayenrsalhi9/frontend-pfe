import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SurveyService } from "../survey.service";
import { Subject, of, forkJoin } from "rxjs";
import { takeUntil, switchMap, catchError, map } from "rxjs/operators";
import { CommonService } from "@app/shared/services/common.service";
import { SecurityService } from "@app/core/security/security.service";
import { User } from "@app/shared/enums/user-auth";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { EMPTY } from "rxjs";

type SurveyType = "simple" | "rating" | "satisfaction";

@Component({
  selector: "app-survey-add",
  templateUrl: "./survey-add.component.html",
  styleUrls: ["./survey-add.component.scss"],
})
export class SurveyAddComponent implements OnInit, OnDestroy {
  surveyForm: FormGroup;
  users: User[] = [];
  allUsers: User[] = [];
  isLoading = false;
  isEdit = false;
  isSubmitted = false;
  surveyId: string | null = null;
  private destroy$ = new Subject<void>();

  surveyType: readonly SurveyType[] = ["simple", "rating", "satisfaction"];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private commonService: CommonService,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.createSurveyForm();
    this.checkEditMode().then(() => {
      if (!this.isEdit) {
        this.loadUsers();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkEditMode(): Promise<void> {
    return new Promise((resolve) => {
      this.activatedRoute.paramMap
        .pipe(takeUntil(this.destroy$))
        .subscribe((params) => {
          const id = params.get("id");
          if (id) {
            this.isEdit = true;
            this.surveyId = id;
            this.loadSurvey(id);
          }
          resolve();
        });
    });
  }

  private loadSurvey(id: string): void {
    this.isLoading = true;
    this.surveyService
      .getSurvey(id)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((data: any) => {
          if (this.allUsers && this.allUsers.length > 0) {
            return of({ data, allUsers: this.allUsers });
          }
          return this.commonService.getUsers().pipe(
            map((allUsers: User[]) => ({ data, allUsers })),
            catchError((err) => {
              console.error("Error loading users:", err);
              this.toastr.error(
                this.translate.instant("ADD.SHARED.ERRORS.NETWORK_ERROR"),
              );
              return of({ data, allUsers: [] });
            }),
          );
        }),
      )
      .subscribe({
        next: ({ data, allUsers }) => {
          this.isLoading = false;
          const selectedUserIds = data.users || [];
          const currentUserId = this.securityService.securityObject?.user?.id;
          const selectedUsers = allUsers.filter(
            (u) => selectedUserIds.includes(u.id) && u.id !== currentUserId,
          );
          this.allUsers = allUsers;
          this.users = allUsers.filter((u) => u.id !== currentUserId);
          this.surveyForm.patchValue({
            title: data.title,
            type: data.type,
            forum: data.forum,
            blog: data.blog,
            private: data.privacy === "private",
            users: selectedUsers,
          });
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          console.error("Error loading survey:", err);
          this.toastr.error(
            this.translate.instant("ADD.SHARED.ERRORS.NETWORK_ERROR"),
          );
          this.cdr.markForCheck();
        },
      });
  }

  loadUsers() {
    const currentUserId = this.securityService.securityObject?.user?.id;
    this.commonService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: User[]) => {
          this.allUsers = users;
          this.users = users.filter((user) => user.id !== currentUserId);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error("Error loading users:", err);
          this.toastr.error(
            this.translate.instant("ADD.SHARED.ERRORS.NETWORK_ERROR"),
          );
          this.cdr.markForCheck();
        },
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

  get titleControl() {
    return this.surveyForm.get("title");
  }

  get typeControl() {
    return this.surveyForm.get("type");
  }

  get isTitleInvalid() {
    const ctrl = this.titleControl;
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || this.isSubmitted));
  }

  get isTypeInvalid() {
    const ctrl = this.typeControl;
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || this.isSubmitted));
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.surveyForm.valid) {
      this.isLoading = true;
      const formValue = this.surveyForm.value;

      const users = formValue.users?.map((u: User) => u.id) || [];
      const requestData = {
        title: formValue.title,
        type: formValue.type,
        forum: formValue.forum,
        blog: formValue.blog,
        privacy: formValue.private ? "private" : "public",
        users: users,
      };

      const request = this.isEdit
        ? this.surveyService.updateSurvey(this.surveyId, requestData)
        : this.surveyService.addSurvey(requestData);

      request.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.isLoading = false;
          const toastKey = this.isEdit
            ? "EDIT.SURVEY.TOAST.SUCCESS"
            : "ADD.SURVEY.TOAST.SUCCESS";
          this.toastr.success(this.translate.instant(toastKey));
          this.router.navigate(["/apps/surveys"]);
        },
        error: (err) => {
          this.isLoading = false;
          const toastKey = this.isEdit
            ? "EDIT.SURVEY.TOAST.ERROR"
            : "ADD.SURVEY.TOAST.ERROR";
          this.toastr.error(this.translate.instant(toastKey));
          console.error("Error saving survey:", err);
        },
      });
    } else {
      this.surveyForm.markAllAsTouched();
      this.toastr.warning(
        this.translate.instant("ADD.SHARED.ERRORS.VALIDATION_ERROR"),
      );
    }
  }

  onCancel() {
    this.router.navigate(["/apps/surveys"]);
  }

  compareUsersById = (a: User, b: User): boolean => a?.id === b?.id;
}
