import { ResourceParameter } from "./resource-parameter";
import { User } from "./user";

export class  ArticleResource extends ResourceParameter {
  id?: string;
  title?: string;
  shortText?: string;
  longText?: string;
  picture?: string;
  privacy?:string;
  createdBy?:string;
  createdAt?:string;
  articleCategoryId?:string;
  updatedAt?:string;
  users?:string;
  creator?:User;
}
