import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DayOfWeek } from '@app/shared/enums/dayOfWeek.enum';
import { DocumentInfo } from '@app/shared/enums/document-info';
import { Frequency } from '@app/shared/enums/frequency.enum';
import { Quarter } from '@app/shared/enums/quarter.enum';
import { Reminder } from '@app/shared/enums/reminder';
import { ReminderFrequency } from '@app/shared/enums/reminder-frequency';
import { User } from '@app/shared/enums/user-auth';
import { CommonService } from '@app/shared/services/common.service';
import { ReminderService } from '@app/shared/services/reminder.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { arLocale, frLocale, enGbLocale, defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

defineLocale('ar', arLocale);
defineLocale('fr', frLocale);
defineLocale('en', enGbLocale);

@Component({
  selector: 'app-document-reminder',
  templateUrl: './document-reminder.component.html',
  styleUrls: ['./document-reminder.component.css']
})
export class DocumentReminderComponent implements OnInit {

  reminderFrequencies: ReminderFrequency[] = [];
  reminderForm: FormGroup;
  minDate = new Date();
  users: User[] = [];
  selectedUsers: User[] = [];
  reminder: Reminder;
  isLoading = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  width: any;
  height: any;
  maxHeight: any;
  panelClass: any;
  data: any;

  dayOfWeek = [
    {
      id: 0,
      name: 'reminder_doc.dayOfWeek.Sunday',
    },
    {
      id: 1,
      name: 'reminder_doc.dayOfWeek.Monday',
    },
    {
      id: 2,
      name: 'reminder_doc.dayOfWeek.Tuesday',
    },
    {
      id: 3,
      name: 'reminder_doc.dayOfWeek.Wednesday',
    },
    {
      id: 4,
      name: 'reminder_doc.dayOfWeek.Thursday',
    },
    {
      id: 5,
      name: 'reminder_doc.dayOfWeek.Friday',
    },
    {
      id: 6,
      name: 'reminder_doc.dayOfWeek.Saturday',
    },
  ];

  months = [
    {
      id: 1,
      name: 'reminder_doc.months.January',
    },
    {
      id: 2,
      name: 'reminder_doc.months.February',
    },
    {
      id: 3,
      name: 'reminder_doc.months.March',
    },
    {
      id: 4,
      name: 'reminder_doc.months.April',
    },
    {
      id: 5,
      name: 'reminder_doc.months.May',
    },
    {
      id: 6,
      name: 'reminder_doc.months.June',
    },
    {
      id: 7,
      name: 'reminder_doc.months.July',
    },
    {
      id: 8,
      name: 'reminder_doc.months.August',
    },
    {
      id: 9,
      name: 'reminder_doc.months.September',
    },
    {
      id: 10,
      name: 'reminder_doc.months.October',
    },
    {
      id: 11,
      name: 'reminder_doc.months.November',
    },
    {
      id: 12,
      name: 'reminder_doc.months.December',
    },
  ];

  days: number[] = [];

  get dailyRemindersArray(): FormArray {
    return <FormArray>this.reminderForm.get('dailyReminders');
  }

  get quarterlyRemindersArray(): FormArray {
    return <FormArray>this.reminderForm.get('quarterlyReminders');
  }

  get halfYearlyRemindersArray(): FormArray {
    return <FormArray>this.reminderForm.get('halfYearlyReminders');
  }

  constructor(
    private fb: FormBuilder,
    private reminderService: ReminderService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    public bsModalRef: BsModalRef,
    private cdr:ChangeDetectorRef,
    private translate: TranslateService,
    private bsLocaleService: BsLocaleService
  ) {


  }

  ngOnInit(): void {
    this.bsLocaleService.use(this.translate.currentLang.split('_')[0])

    this.bsModalRef.setClass('modal-lg')


    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
    this.getReminderFrequency();
    this.createReminderForm();
    this.getUsers();
  }

  closeDialog() {
    this.bsModalRef.hide();
  }

  getReminderFrequency() {
    this.commonService
      .getReminderFrequency()
      .subscribe((f) => (this.reminderFrequencies = [...f]));
  }

  createReminderForm() {
    const currentDate = new Date();
    this.reminderForm = this.fb.group({
      id: [''],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      frequency: [''],
      isRepeated: [false],
      isEmailNotification: [false],
      startDate: [currentDate, [Validators.required]],
      endDate: [null],
      dayOfWeek: [2],
      documentId: [this.data.id],
    });
  }

  checkData(event: any) {
    if (event.checked) {
      this.reminderForm.get('frequency').setValidators([Validators.required]);
    } else {
      this.reminderForm.get('frequency').setValidators([]);
      this.reminderForm.get('frequency').updateValueAndValidity();
    }
    this.reminderForm.markAllAsTouched();
    this.cdr.detectChanges()
  }

  createReminder() {

    if (!this.reminderForm.valid) {
      this.reminderForm.markAllAsTouched();
      return;
    }
    const reminder: Reminder = this.reminderForm.value;
    reminder.reminderUsers = this.selectedUsers.map((u) => {
      return {
        reminderId: reminder.id,
        userId: u.id,
      };
    });

    if (!reminder.isRepeated) {
      reminder.dailyReminders = [];
      reminder.quarterlyReminders = [];
      reminder.halfYearlyReminders = [];
    }

    if (!this.reminder) {
      this.isLoading = true;
      this.reminderService
        .addDocumentReminder(reminder)
        .subscribe(
          (d) => {
            this.translate.get('DOCUMENTS.REMINDER.TOAST.REMINDER_CREATED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
              this.toastrService.success(translatedMessage);
            });
            // this.route.navigate(['/reminders']);
            this.bsModalRef.hide();
            this.isLoading = false;
          },
          () => (this.isLoading = false)
        );
    } else {
      if (reminder.dailyReminders) {
        reminder.dailyReminders = reminder.dailyReminders.map((c) => {
          c.reminderId = this.reminder.id;
          return c;
        });
      }
      if (reminder.quarterlyReminders) {
        reminder.quarterlyReminders = reminder.quarterlyReminders.map((c) => {
          c.reminderId = this.reminder.id;
          return c;
        });
      }
      if (reminder.halfYearlyReminders) {
        reminder.halfYearlyReminders = reminder.halfYearlyReminders.map((c) => {
          c.reminderId = this.reminder.id;
          return c;
        });
      }
      this.isLoading = true;
      this.reminderService.updateReminder(reminder).subscribe(
        (d) => {
          this.translate.get('DOCUMENTS.REMINDER.TOAST.REMINDER_UPDATED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage);
          });
          // this.route.navigate(['/reminders']);
          this.bsModalRef.hide();
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    }
  }

  onSelectChange(event:any) {
    this.selectedUsers = event
  }

  getUsers() {
    this.commonService
      .getUsersForDropdown()
      .subscribe((u: User[]) => {
        this.users = u;
        if (this.reminder) {
          const reminderUsers = this.reminder.reminderUsers.map(
            (c) => c.userId
          );
          this.selectedUsers = this.users.filter(
            (c) => reminderUsers.indexOf(c.id) >= 0
          );
        }
      });
  }

  onFrequencyChange() {
    let frequency = this.reminderForm.get('frequency').value;
    frequency = frequency == 0 ? '0' : frequency;
    if (frequency == Frequency.Daily.toString()) {
      this.removeQuarterlyReminders();
      this.removeHalfYearlyReminders();
      this.addDailReminders();
      this.reminderForm.get('dayOfWeek').setValue('');
    } else if (frequency == Frequency.Weekly.toString()) {
      this.removeDailReminders();
      this.removeQuarterlyReminders();
      this.removeHalfYearlyReminders();
      this.reminderForm.get('dayOfWeek').setValue(2);
    } else if (frequency == Frequency.Quarterly.toString()) {
      this.removeDailReminders();
      this.removeHalfYearlyReminders();
      this.addQuarterlyReminders();
      this.reminderForm.get('dayOfWeek').setValue('');
    } else if (frequency == Frequency.HalfYearly.toString()) {
      this.removeDailReminders();
      this.removeQuarterlyReminders();
      this.addHalfYearlyReminders();
      this.reminderForm.get('dayOfWeek').setValue('');
    } else {
      this.removeDailReminders();
      this.removeQuarterlyReminders();
      this.removeHalfYearlyReminders();
      this.reminderForm.get('dayOfWeek').setValue('');
    }
    this.cdr.detectChanges()
  }

  addDailReminders() {
    if (!this.reminderForm.contains('dailyReminders')) {
      const formArray = this.fb.array([]);
      formArray.push(this.createDailyReminderFormGroup(DayOfWeek.Sunday));
      formArray.push(this.createDailyReminderFormGroup(DayOfWeek.Monday));
      formArray.push(this.createDailyReminderFormGroup(DayOfWeek.Tuesday));
      formArray.push(this.createDailyReminderFormGroup(DayOfWeek.Wednesday));
      formArray.push(this.createDailyReminderFormGroup(DayOfWeek.Thursday));
      formArray.push(this.createDailyReminderFormGroup(DayOfWeek.Friday));
      formArray.push(this.createDailyReminderFormGroup(DayOfWeek.Saturday));
      this.reminderForm.addControl('dailyReminders', formArray);
    }
  }

  addQuarterlyReminders() {
    if (!this.reminderForm.contains('quarterlyReminders')) {
      const formArray = this.fb.array([]);
      const firstQuaterMonths = this.months.filter(
        (c) => [1, 2, 3].indexOf(c.id) >= 0
      );
      const secondQuaterMonths = this.months.filter(
        (c) => [4, 5, 6].indexOf(c.id) >= 0
      );
      const thirdQuaterMonths = this.months.filter(
        (c) => [7, 8, 9].indexOf(c.id) >= 0
      );
      const forthQuaterMonths = this.months.filter(
        (c) => [10, 11, 12].indexOf(c.id) >= 0
      );
      formArray.push(
        this.createQuarterlyReminderFormGroup(
          Quarter.Quarter1,
          'reminder_doc.quartly.Jan - Mar',
          firstQuaterMonths
        )
      );
      formArray.push(
        this.createQuarterlyReminderFormGroup(
          Quarter.Quarter2,
          'reminder_doc.quartly.Apr - Jun',
          secondQuaterMonths
        )
      );
      formArray.push(
        this.createQuarterlyReminderFormGroup(
          Quarter.Quarter3,
          'reminder_doc.quartly.Jul - Sept',
          thirdQuaterMonths
        )
      );
      formArray.push(
        this.createQuarterlyReminderFormGroup(
          Quarter.Quarter4,
          'reminder_doc.quartly.Oct - Dec',
          forthQuaterMonths
        )
      );
      this.reminderForm.addControl('quarterlyReminders', formArray);
    }
  }

  addHalfYearlyReminders() {
    if (!this.reminderForm.contains('halfYearlyReminders')) {
      const formArray = this.fb.array([]);
      const firstQuaterMonths = this.months.filter(
        (c) => [1, 2, 3, 4, 5, 6].indexOf(c.id) >= 0
      );
      const secondQuaterMonths = this.months.filter(
        (c) => [7, 8, 9, 10, 11, 13].indexOf(c.id) >= 0
      );
      formArray.push(
        this.createHalfYearlyReminderFormGroup(
          Quarter.Quarter1,
          'reminder_doc.halfy.Jan - Jun',
          firstQuaterMonths
        )
      );
      formArray.push(
        this.createHalfYearlyReminderFormGroup(
          Quarter.Quarter2,
          'reminder_doc.halfy.Jul - Dec',
          secondQuaterMonths
        )
      );
      this.reminderForm.addControl('halfYearlyReminders', formArray);
    }
  }

  removeDailReminders() {
    if (this.reminderForm.contains('dailyReminders')) {
      this.reminderForm.removeControl('dailyReminders');
    }
  }

  removeQuarterlyReminders() {
    if (this.reminderForm.contains('quarterlyReminders')) {
      this.reminderForm.removeControl('quarterlyReminders');
    }
  }

  removeHalfYearlyReminders() {
    if (this.reminderForm.contains('halfYearlyReminders')) {
      this.reminderForm.removeControl('halfYearlyReminders');
    }
  }

  createDailyReminderFormGroup(dayOfWeek: DayOfWeek) {
    return this.fb.group({
      id: [''],
      reminderId: [''],
      dayOfWeek: [dayOfWeek],
      isActive: [true],
      name: ['reminder_doc.dayOfWeek.'+DayOfWeek[dayOfWeek]],
    });
  }

  createQuarterlyReminderFormGroup(
    quater: Quarter,
    name: string,
    monthValues: any[]
  ) {
    return this.fb.group({
      id: [''],
      reminderId: [''],
      quarter: [quater],
      day: [this.getCurrentDay()],
      month: [monthValues[0]],
      name: [name],
      monthValues: [monthValues],
    });
  }

  createHalfYearlyReminderFormGroup(
    quater: Quarter,
    name: string,
    monthValues: any[]
  ) {
    return this.fb.group({
      id: [''],
      reminderId: [''],
      quarter: [quater],
      day: [this.getCurrentDay()],
      month: [monthValues[0]],
      name: [name],
      monthValues: [monthValues],
    });
  }

  getCurrentDay(): number {
    return new Date().getDate();
  }

  onDateChange(formGrouup: any) {
    const day = formGrouup.get('day').value;
    const month = formGrouup.get('month').value;
    const daysInMonth = new Date(
      new Date().getFullYear(),
      Number.parseInt(month),
      0
    ).getDate();
    if (day > daysInMonth) {
      formGrouup.setErrors({
        invalidDate: 'Invalid Date',
      });
      formGrouup.markAllAsTouched();
    }
  }

  onCancel() {
    this.bsModalRef.hide();
  }
}
