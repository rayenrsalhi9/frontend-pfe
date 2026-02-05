import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../survey.service';

@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.component.html',
  styleUrls: ['./survey-edit.component.css']
})
export class SurveyEditComponent implements OnInit {

  surveyForm: FormGroup;
  surveyType = [
    "simple",
    "rating",
    /* "response", */
    "satisfaction"
  ]
  surveyId = null

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private surveyService: SurveyService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.createSurveyForm()
    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')
      this.surveyId = id
      if(id) {
        this.surveyService.getSurvey(id).subscribe(
          (data:any)=>{
            this.surveyForm.patchValue({
              title:data.title,
              type:data.type,
              forum:data.forum,
              blog:data.blog,
              private:data.privacy=='private'?true:false,
            })
            this.cdr.markForCheck()
          }
        )
      }
    })
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
      this.surveyService.updateSurvey(this.surveyId, this.surveyForm.value).subscribe(
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
