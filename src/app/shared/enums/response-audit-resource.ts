import { ResourceParameter } from './resource-parameter';

export class ResponseAuditResource extends ResourceParameter {
  forumId?: string = '';
  responseId?: string = '';
  operation?: string = '';
  userId?: string = '';
  dateFrom?: string = '';
  dateTo?: string = '';
  responseType?: 'comment' | 'reaction' | 'all' = 'all';
}