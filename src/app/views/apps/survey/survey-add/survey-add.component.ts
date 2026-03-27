import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../survey.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from '@app/shared/services/common.service';
import { User } from '@app/shared/enums/user-auth';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-survey-add',
  templateUrl: './survey-add.component.html',
  styleUrls: ['./survey-add.component.css']
})
export class SurveyAddComponent implements OnInit, OnDestroy {

  surveyForm: FormGroup;
  users: User[] = [];
  private destroy$ = new Subject<void>();
  surveyType = [
    "simple",
    "rating",
    /* "response", */
    "satisfaction"
  ]

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private surveyService: SurveyService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.createSurveyForm();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.commonService.getUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  createSurveyForm() {
    this.surveyForm = this.fb.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      users: [[]],
      private: [false],
      blog: [true, [Validators.required]],
      forum: [true, [Validators.required]],
    });
  }

  saveSurvey() {

    if (this.surveyForm.valid) {

      this.surveyService.addSurvey(this.surveyForm.value).subscribe(
        (data:any)=>{
          console.log(data);
          this.router.navigate(['/apps/surveys'])
        }
      )
    } else {
      this.surveyForm.markAllAsTouched();
    }
  }

}
