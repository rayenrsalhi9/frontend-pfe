import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ResponseAuditTrailService } from '@app/shared/services/response-audit-trail.service';
import { ResponseAuditResource } from '@app/shared/enums/response-audit-resource';
import { ResponseAuditTrail } from '@app/shared/enums/response-audit-trail';
import { CommonError } from '@app/shared/enums/common-error';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-responses-audit',
  templateUrl: './responses-audit.component.html',
  styleUrls: ['./responses-audit.component.css']
})
export class ResponsesAuditComponent implements OnInit {

  rows: ResponseAuditTrail[] = [];
  filteredRows: ResponseAuditTrail[] = [];
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  loading: boolean = false;
  totalCount: number = 0;
  pageSize: number = 50;
  skip: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private responseAuditTrailService: ResponseAuditTrailService
  ) { }

  ngOnInit(): void {
    this.loadResponseAuditTrails();
  }

  loadResponseAuditTrails(): void {
    this.loading = true;
    
    const resource: ResponseAuditResource = {
      fields: 'id,forumId,forumTitle,responseId,responseType,operationName,responseContent,previousContent,ipAddress,userAgent,createdBy,createdByName,createdDate,modifiedBy,modifiedDate',
      orderBy: 'createdDate desc',
      pageSize: this.pageSize,
      skip: this.skip,
      searchQuery: '',
      forumId: '',
      userId: '',
      operation: '',
      responseType: 'all',
      dateFrom: '',
      dateTo: '',
      name: '',
      description: '',
      totalCount: 0,
      metaTags: ''
    };

    this.responseAuditTrailService.getResponseAuditTrails(resource).subscribe({
      next: (response: HttpResponse<ResponseAuditTrail[]> | CommonError) => {
        if (response instanceof HttpResponse) {
          this.rows = response.body || [];
          this.filteredRows = [...this.rows];
          this.totalCount = parseInt(response.headers.get('totalCount') || '0');
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading response audit trails:', error);
        this.loading = false;
        this.rows = [];
        this.filteredRows = [];
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(term: string): void {
    if (!term || term.trim() === '') {
      this.filteredRows = [...this.rows];
    } else {
      const searchTerm = term.toLowerCase();
      this.filteredRows = this.rows.filter(row => {
        return (
          row.createdByName?.toLowerCase().includes(searchTerm) ||
          row.forumTitle?.toLowerCase().includes(searchTerm) ||
          row.responseContent?.toLowerCase().includes(searchTerm) ||
          row.operationName?.toLowerCase().includes(searchTerm) ||
          row.ipAddress?.toLowerCase().includes(searchTerm)
        );
      });
    }
    this.cdr.detectChanges();
  }

}
