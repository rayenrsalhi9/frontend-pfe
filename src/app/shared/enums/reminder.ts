import { ReminderUsers } from "./reminder-users";

export class Reminder {
  id?: string;
  eventName: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  documentId?: string;
  documentName?: string;
  frequencyId: string;
  reminderDate: Date;
  isRepeated: boolean;
  isEmailNotification: boolean;
  reminderUsers: ReminderUsers[];
  dailyReminders: DailyReminders[];
}

export class DailyReminders {
  id: string;
  reminderId: string;
  dayOfWeek: number;
  isActive: boolean;
}
