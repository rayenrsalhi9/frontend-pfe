import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { SurveyService } from '../survey.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-add',
  templateUrl: './survey-add.component.html',
  styleUrls: ['./survey-add.component.css']
})
export class SurveyAddComponent implements OnInit {

  surveyForm: FormGroup;
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
  ) { }

  ngOnInit(): void {
    this.createSurveyForm()
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
