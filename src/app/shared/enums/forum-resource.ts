import { ResourceParameter } from "./resource-parameter";
import { User } from "./user";

export class  ForumResource extends ResourceParameter {
  id?: string;
  title?: string;
  content?: string;
  privacy?:any;
  closed?:any;
  reactions?:any;
  category?:any;
  createdBy?:string;
  createdAt?:string;
  tags?:any;
  updatedAt?:string;
  users?:string;
  creator?:User;
}
