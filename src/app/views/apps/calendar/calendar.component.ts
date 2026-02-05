import { Component, ViewChildren, ViewChild, TemplateRef, OnInit, AfterViewInit, QueryList, ChangeDetectorRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { GenerateUid } from '@app/shared/utils/GenerateUid';
import { combineLatest } from 'rxjs';
import { CommonService } from '@app/shared/services/common.service';
import { ReminderService } from '@app/shared/services/reminder.service';
import { ReminderResourceParameter } from '@app/shared/enums/reminder-resource-parameter';
import { HttpResponse } from '@angular/common/http';
import { User } from '@app/shared/enums/user';
import { ToastrService } from 'ngx-toastr';
import { Reminder } from '@app/shared/enums/reminder';
import { defineLocale, arLocale, frLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

interface CalendarAppEvent extends CalendarEvent {
  description?: string
}

defineLocale('ar', arLocale);
defineLocale('fr', frLocale);
defineLocale('en', enGbLocale);

const colors: any = {
  red: {
    primary: '#ef2733',
    secondary: '#fde9eb',
  },
  blue: {
    primary: '#3d5ef8',
    secondary: '#eef1fe',
  },
  yellow: {
    primary: '#ff8911',
    secondary: '#fff4ea',
  },
};

const colorsSelection: any[] = [
  {
    color: colors.red
  },
  {
    color: colors.blue
  },
  {
    color: colors.yellow
  }
]

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, AfterViewInit {

  @ViewChildren(PopoverDirective) popovers: QueryList<PopoverDirective>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  reminderResource: ReminderResourceParameter;
  modalRef: BsModalRef;
  modalMode: 'add' | 'edit' = 'add'
  formGroup: FormGroup;
  selectedEventId: string | number
  modalData: {
    action: string;
    event: CalendarAppEvent;
  };
  colorsSelection: string[] = []
  refresh: Subject<any> = new Subject();
  events: CalendarAppEvent[] = [];
  users:User[]
  locale: string = '';

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private commonService:CommonService,
    private reminderService:ReminderService,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private bsLocaleService: BsLocaleService
  ) {
    this.reminderResource = new ReminderResourceParameter();
    if (localStorage.getItem('lang') === 'en_US') {
      this.locale = 'en';
    } else if (localStorage.getItem('lang') === 'fr_FR') {
      this.locale = 'fr';
    } else if (localStorage.getItem('lang') === 'ar_AR') {
      this.locale = 'ar';
    }
  }

  ngOnInit(): void {
    this.bsLocaleService.use(this.translate.currentLang.split('_')[0])
    this.getReminders()
    this.getUsers()
    for (const key in colors) {
      if (Object.prototype.hasOwnProperty.call(colors, key)) {
        this.colorsSelection.push(key)
      }
    }
    this.formGroup = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      start: [startOfDay(new Date()), Validators.required],
      end: [endOfDay(new Date()), Validators.required],
      color: [this.colorsSelection[0], Validators.required],
      description: [''],
      reminderUsers:[[], Validators.required]
    });
  }

  getReminders() {
    this.reminderService.getReminders(this.reminderResource).subscribe(
      (data:HttpResponse<any>)=>{
        this.events = []
        data.body.forEach((el:any) => {
          this.events = [
            ...this.events,
            {
              id:el.id,
              title:el.subject,
              description:el.description,
              start:startOfDay(new Date(el.startDate)),
              end:startOfDay(new Date(el.endDate)),
              draggable:false,
              allDay:true,
              color:colors.red
            }
          ];
          this.cdr.markForCheck()
        });
      }
    )
    this.cdr.detectChanges()
  }

  getReminderFrequency() {
    this.commonService
      .getReminderFrequency()
      .subscribe((f) => {
      });
  }

  ngAfterViewInit() {
    this.popovers.forEach((popover: PopoverDirective) => {
      popover.onShown.subscribe(() => {
        this.popovers
          .filter(p => p !== popover)
          .forEach(p => p.hide());
      });
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarAppEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarAppEvent): void {
    this.modalData = { event, action };
  }

  getColorDetail(val: string) {
    return colors[val]
  }

  eventAddOn(color: string) {
    return {
      color: this.getColorDetail(color),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    }
  }

  getUsers() {
    this.commonService
      .getUsersForDropdown()
      .subscribe((users: User[]) => (this.users = users));
  }

  addEvent(): void {

    let data = this.formGroup.value

    data.reminderUsers = data.reminderUsers.map((u) => {
      return {
        reminderId: data.id,
        userId: u,
      };
    });
    const formData:any = {
      dailyReminders:[],
      dayOfWeek:2,
      documentId:null,
      frequency:"",
      halfYearlyReminders:[],
      quarterlyReminders:[],
      isEmailNotification: false,
      isRepeated: false,

      id:data.id,
      subject:data.title,
      message:data.description,
      startDate:data.start,
      endDate:data.end,
      reminderUsers:data.reminderUsers,
    }

    this.reminderService.addReminder(formData).subscribe(
      (d) => {
        this.translate.get('CALENDAR.TOAST.REMINDER_CREATED').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage);
        });
        this.modalRef.hide()
        this.resetForm()
        this.getReminders()
      },
    );

    /* const dataAddon = this.eventAddOn(data.color)
    data = { ...data, ...dataAddon }
    this.events = [
      ...this.events,
      data
    ];
    this.modalRef.hide()
    this.resetForm() */
  }

  editEvent() {
    let data = this.formGroup.value

    data.reminderUsers = data.reminderUsers.map((u) => {
      return {
        reminderId: data.id,
        userId: u,
      };
    });

    const formData:any = {
      dailyReminders:[],
      dayOfWeek:2,
      documentId:null,
      frequency:"",
      halfYearlyReminders:[],
      quarterlyReminders:[],
      isEmailNotification: false,
      isRepeated: false,

      id:data.id,
      subject:data.title,
      message:data.description,
      startDate:data.start,
      endDate:data.end,
      reminderUsers:data.reminderUsers,
    }

    this.reminderService.updateReminder(formData).subscribe(
      (d) => {
        this.translate.get('CALENDAR.TOAST.REMINDER_UPDATED').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage);
        });
        this.modalRef.hide()
        this.resetForm()
        this.getReminders()
      },
    );
  }

  deleteEvent(id: string | number | any) {

    this.reminderService.deleteReminder(id).subscribe(data=>{
      this.translate.get('CALENDAR.TOAST.REMINDER_DELETED').subscribe((translatedMessage: string) => {
        this.toastrService.success(translatedMessage);
      });
      this.getReminders()
    })
    //this.events = this.events.filter((event) => event.id !== id);
  }

  resetForm() {
    this.modalMode = 'add'
    this.formGroup.reset();
    this.formGroup.setValue({
      id: '',
      title: '',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: this.colorsSelection[0],
      description: '',
      reminderUsers:[]
    })
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  openEditEventModal(template: TemplateRef<any>, id: string | number | any) {
    this.commonService.getReminder(id).subscribe((data:any)=>{
      this.modalMode = 'edit'
      this.modalRef = this.modalService.show(template);
      this.formGroup.setValue({
        id: data.id,
        title: data.subject,
        start: new Date(data.startDate),
        end: new Date(data.endDate),
        color: this.colorsSelection[0],
        description: data.message,
        reminderUsers:data.reminderUsers.map((u:any)=>{return u.userId})
      })
    })




    /* this.modalMode = 'edit'
    this.modalRef = this.modalService.show(template);
    let data = this.events.filter(elm => elm.id === id)[0]
    let color: string
    for (const key in colors) {
      if (Object.prototype.hasOwnProperty.call(colors, key)) {
        const element = colors[key];
        if (element.primary === data.color.primary) {
          color = key
        }
      }
    }
    this.formGroup.setValue({
      id: data.id,
      title: data.title,
      start: data.start,
      end: data.end,
      color: color,
      description: data.description
    })
    this.onModalClose() */
  }

  openAddEventModal(template: TemplateRef<any>) {
    this.modalMode = 'add'
    this.modalRef = this.modalService.show(template);
    this.onModalClose()
  }

  onModalClose() {
    const _combine = combineLatest(
      this.modalRef.onHide,
      this.modalRef.onHidden
    ).subscribe(() => this.cdr.markForCheck());
    this.modalRef.onHide.subscribe((reason: string | any) => {
      this.resetForm()
    })
  }

}
