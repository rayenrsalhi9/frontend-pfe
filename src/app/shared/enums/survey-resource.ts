import { ResourceParameter } from "./resource-parameter";
import { User } from "./user";

export class  SurveyResource extends ResourceParameter {
  id?: string;
  title?: string;
  startDate?:any;
  endDate?:any;
  closed?:any;
  blog?:any;
  forum?:any;
  type?:any;
  answers?:any;
  privacy?:string;
  createdBy?:string;
  updatedAt?:string;
  createdAt?:string;
  users?:string;
  creator?:User;
}
