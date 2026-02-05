export class ReminderFrequency {
  id: number;
  name: string;
}

export const reminderFrequencies: ReminderFrequency[] = [
  {
    id: 0,
    name: 'reminder_doc.ReminderFrequency.Daily'
  }, {
    id: 1,
    name: 'reminder_doc.ReminderFrequency.Weekly'
  }, {
    id: 2,
    name: 'reminder_doc.ReminderFrequency.Monthly'
  }, {
    id: 3,
    name: 'reminder_doc.ReminderFrequency.Quarterly'
  }, {
    id: 4,
    name: 'reminder_doc.ReminderFrequency.Half_Yearly'
  }, {
    id: 5,
    name: 'reminder_doc.ReminderFrequency.Yearly'
  }
];
