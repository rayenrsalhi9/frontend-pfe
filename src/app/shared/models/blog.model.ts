import { User } from "./user.model";

export interface Blog {
  id: string;
  title: string;
  subtitle?: string;
  picture?: string;
  body?: string;
  createdAt?: string;
  creator?: User;
  category?: {
    id: string;
    name: string;
  };
  comments?: BlogComment[];
  commentsCount?: number;
  reactionsUp?: any[];
  reactionsDown?: any[];
  reactionsUpCount?: number;
  reactionsDownCount?: number;
}

export interface BlogComment {
  id: string;
  comment: string;
  user?: User;
  createdAt?: string;
}
