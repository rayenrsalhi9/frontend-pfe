import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticleResource } from '@app/shared/enums/article-resource';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SurveyService } from '../survey.service';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
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
  surveyResource: SurveyResource
  searchSubject: Subject<void> = new Subject<void>();
  isLoadingResults = false;

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
    this.searchSubject.pipe(
      debounceTime(300),
      tap(() => this.isLoadingResults = true),
      switchMap(() => this.surveyService.allSurveys(this.surveyResource).pipe(
        catchError(err => {
          console.log(err);
          this.isLoadingResults = false;
          return of(null);
        })
      ))
    ).subscribe((data : any)=>{
      if (data) {
        this.rows = data;
      }
      this.isLoadingResults = false;
      this.cdr.markForCheck();
    });
    this.searchSubject.next();
  }

  getAllSurveys(data = this.surveyResource){
    this.surveyResource = data;
    this.searchSubject.next();
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
    this.surveyResource.title = val ? val : "";
    this.surveyResource.skip = 0;
    this.searchSubject.next();
  }

  onCategoryChange(event: any) {
    this.surveyResource.type = event ? event : "";
    this.surveyResource.skip = 0;
    this.searchSubject.next();
  }

  onDateChange(event: any) {
    this.surveyResource.createdAt = event ? new Date(event).toDateString() : "";
    this.surveyResource.skip = 0;
    this.searchSubject.next();
  }

}
