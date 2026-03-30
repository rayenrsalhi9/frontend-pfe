import { User } from "./user.model";

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  picture?: string;
  longText?: string;
  createdAt?: string;
  creator?: User;
  category?: {
    id: string;
    name: string;
  };
  comments?: ArticleComment[];
  commentsCount?: number;
}

export interface ArticleComment {
  id: string;
  comment: string;
  user?: User;
  createdAt?: string;
}
