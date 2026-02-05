import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticleResource } from '@app/shared/enums/article-resource';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SurveyService } from '../survey.service';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SurveyResource } from '@app/shared/enums/survey-resource';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {

  showMobilePanel = false

  rows: any[] = [];
  selected = [];
  categories:any[] = [
    "simple",
    "rating",
    /* "response", */
    "satisfaction"
  ]

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  bsModalRef: BsModalRef;
  surveyResource:SurveyResource

  constructor(
    private surveyService:SurveyService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private toastr: ToastrService,
  ) {
    this.surveyResource = new SurveyResource();
  }

  ngOnInit(): void {
    this.getAllSurveys()
  }

  getAllSurveys(data = this.surveyResource){
    this.surveyService.allSurveys(data).subscribe(
      (data:any)=>{
        this.rows = data
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  deleteSurvey(data:any) {

    this.translateService.get('SURVEY.DELETE.LABEL').subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm
          }
        }
      });
    });

    this.bsModalRef.content.onClose.subscribe(result => {
      if (result) {
        this.surveyService.deleteSurvey(data.id).subscribe(
          (data: any) => {
            this.translateService.get('SURVEY.DELETE.TOAST.DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {this.toastr.success(translatedMessage); });
            this.getAllSurveys()
          }
        )

      }
    })

    /* this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Vous étes sur ?',
        message: 'Vous étes sur de vouloir supprime ce sondage ?',
        button: { cancel: 'Cancel', confirm: 'confirm' },
      }
    })

    this.bsModalRef.content.onClose.subscribe(result => {
      if (result) {

        this.surveyService.deleteSurvey(data.id).subscribe(
          (data: any) => {
            this.getAllSurveys()
          }
        )

      }
    }) */
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  getAnswerCount(value:number, results:any[]) {
    return results.filter((val) => val.answer === value).length
  }

  onActivate(event) {
  }

  onNameChange(event: any) {
    let val = event.target.value
    if (val) {
      this.surveyResource.title = val;
    } else {
      this.surveyResource.title = '';
    }
    this.surveyResource.skip = 0;
    this.getAllSurveys(this.surveyResource);
  }

  onCategoryChange(event: any) {
    if (event) {
      this.surveyResource.type = event;
    } else {
      this.surveyResource.type = '';
    }
    this.surveyResource.skip = 0;
    this.getAllSurveys(this.surveyResource);
  }

  onDateChange(event: any) {
    if (event) {
      this.surveyResource.createdAt = new Date(event).toDateString();
    } else {
      this.surveyResource.createdAt = '';
    }
    this.surveyResource.skip = 0;
    this.getAllSurveys(this.surveyResource);
  }

}
