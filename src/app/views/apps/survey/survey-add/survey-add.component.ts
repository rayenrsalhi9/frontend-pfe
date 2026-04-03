import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SurveyService } from "../survey.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CommonService } from "@app/shared/services/common.service";
import { User } from "@app/shared/enums/user-auth";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-survey-add",
  templateUrl: "./survey-add.component.html",
  styleUrls: ["./survey-add.component.scss"],
})
export class SurveyAddComponent implements OnInit, OnDestroy {
  surveyForm: FormGroup;
  users: User[] = [];
  isLoading = false;
  isEdit = false;
  isSubmitted = false;
  surveyId: any = null;
  private destroy$ = new Subject<void>();

  surveyType = ["simple", "rating", "satisfaction"];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.createSurveyForm();
    this.loadUsers();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkEditMode(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get("id");
        if (id) {
          this.isEdit = true;
          this.surveyId = id;
          this.loadSurvey(id);
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
          this.surveyForm.patchValue({
            title: data.title,
            type: data.type,
            forum: data.forum,
            blog: data.blog,
            private: data.privacy === "private",
            users: data.users || [],
          });
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          console.error("Error loading survey:", err);
          this.toastr.error(this.translate.instant("ADD.SHARED.ERRORS.NETWORK_ERROR"));
        },
      });
  }

  loadUsers() {
    this.commonService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error("Error loading users:", err);
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
      
      const request = this.isEdit 
        ? this.surveyService.updateSurvey(this.surveyId, formValue)
        : this.surveyService.addSurvey(formValue);

      request.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.isLoading = false;
          const toastKey = this.isEdit ? "EDIT.SURVEY.TOAST.SUCCESS" : "ADD.SURVEY.TOAST.SUCCESS";
          this.toastr.success(this.translate.instant(toastKey));
          this.router.navigate(["/apps/surveys"]);
        },
        error: (err) => {
          this.isLoading = false;
          const toastKey = this.isEdit ? "EDIT.SURVEY.TOAST.ERROR" : "ADD.SURVEY.TOAST.ERROR";
          this.toastr.error(this.translate.instant(toastKey));
          console.error("Error saving survey:", err);
        },
      });
    } else {
      this.surveyForm.markAllAsTouched();
      this.toastr.warning(this.translate.instant("ADD.SHARED.ERRORS.VALIDATION_ERROR"));
    }
  }

  onCancel() {
    this.router.navigate(["/apps/surveys"]);
  }
}
