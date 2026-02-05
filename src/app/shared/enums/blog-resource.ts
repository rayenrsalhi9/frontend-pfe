import { ResourceParameter } from "./resource-parameter";
import { User } from "./user";

export class  BlogResource extends ResourceParameter {
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  picture?: string;
  privacy?:any;
  expiration?:any;
  banner?:any;
  category?:any;
  createdBy?:string;
  createdAt?:string;
  startDate?:any;
  endDate?:any;
  tags?:any;
  updatedAt?:string;
  users?:string;
  creator?:User;
}
