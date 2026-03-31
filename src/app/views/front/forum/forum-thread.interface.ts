export interface ForumThread {
  id: string | number;
  title: string;
  closed: boolean;
  createdAt: string | Date;
  category?: {
    name: string;
  };
  commentsCount?: number;
  comments?: any[];
  reactionsCount?: number;
  reactions?: any[];
}
