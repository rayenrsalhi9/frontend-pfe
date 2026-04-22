import { ResourceParameter } from "./resource-parameter";

export class ReminderResourceParameter extends ResourceParameter {
  event_name: string;
  description: string;
  frequency: string;
}
