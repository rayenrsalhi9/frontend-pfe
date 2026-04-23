import { ResourceParameter } from "./resource-parameter";

export class ReminderResourceParameter extends ResourceParameter {
  eventName?: string;
  description = "";
  frequency?: string;
}
