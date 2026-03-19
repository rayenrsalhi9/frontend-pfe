import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ResponseAuditTrailService } from '@app/shared/services/response-audit-trail.service';
import { ResponseAuditResource } from '@app/shared/enums/response-audit-resource';
import { ResponseAuditTrail } from '@app/shared/enums/response-audit-trail';
import { CommonError } from '@app/shared/enums/common-error';
import { HttpResponse } from '@angular/common/http';
import { SecurityService } from '@app/core/security/security.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-responses-audit',
  templateUrl: './responses-audit.component.html',
  styleUrls: ['./responses-audit.component.css']
})
export class ResponsesAuditComponent implements OnInit {

  rows: ResponseAuditTrail[] = [];
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  loading: boolean = false;
  totalCount: number = 0;
  
  responseAuditResource: ResponseAuditResource;

  types: any[] = [];
  actions: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private responseAuditTrailService: ResponseAuditTrailService,
    private securityService: SecurityService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) { 
    this.responseAuditResource = new ResponseAuditResource();
    this.responseAuditResource.pageSize = 10;
  }

  ngOnInit(): void {
    this.types = [
      { id: 'comment', name: this.translateService.instant('RESPONSES.BADGES.COMMENT') },
      { id: 'reaction', name: this.translateService.instant('RESPONSES.BADGES.REACTION') }
    ];
    this.actions = [
      { id: 'Created', name: this.translateService.instant('RESPONSES.BADGES.CREATED') },
      { id: 'Updated', name: this.translateService.instant('RESPONSES.BADGES.UPDATED') },
      { id: 'Deleted', name: this.translateService.instant('RESPONSES.BADGES.DELETED') }
    ];
    this.loadResponseAuditTrails();
  }

  loadResponseAuditTrails(): void {
    this.loading = true;
    
    // Check if user has permission to view response audit trails
    if (!this.securityService.hasClaim('RESPONSE_AUDIT_TRAIL_VIEW_RESPONSE_AUDIT_TRAIL')) {
      this.toastrService.error('You do not have permission to view response audit trails');
      this.loading = false;
      this.rows = [];
      return;
    }
    
    this.responseAuditResource.fields = 'id,forumId,forumTitle,responseId,responseType,operationName,responseContent,previousContent,ipAddress,userAgent,createdBy,createdByName,createdDate,modifiedBy,modifiedDate';

    this.responseAuditTrailService.getResponseAuditTrails(this.responseAuditResource).subscribe({
      next: (response: HttpResponse<ResponseAuditTrail[]> | CommonError) => {
        if (response instanceof HttpResponse) {
          this.rows = response.body || [];
          this.totalCount = parseInt(response.headers.get('totalCount') || '0', 10);
        } else {
          console.error('Error loading response audit trails:', response);
          this.toastrService.error('Failed to load response audit trails');
          this.rows = [];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading response audit trails:', error);
        this.toastrService.error('Failed to load response audit trails. Please try again later.');
        this.loading = false;
        this.rows = [];
        this.cdr.detectChanges();
      }
    });
  }

  extractUserAgentInfo(userAgent: string): string {
    if (!userAgent) return '-';
    
    // Extract browser name and OS info from user agent
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    
    if (browserMatch && osMatch) {
      return `${browserMatch[0]} (${osMatch[1].split(';')[0]})`;
    } else if (browserMatch) {
      return browserMatch[0];
    } else if (osMatch) {
      return osMatch[1].split(';')[0];
    }
    
    return userAgent.substring(0, 50) + (userAgent.length > 50 ? '...' : '');
  }

  onPageChange(event: any) {
    this.responseAuditResource.skip = event.offset * this.responseAuditResource.pageSize;
    this.loadResponseAuditTrails();
  }

  onSearchChange(event: any) {
    const val = event.target.value;
    if (val) {
      this.responseAuditResource.searchQuery = val;
    } else {
      this.responseAuditResource.searchQuery = '';
    }
    this.responseAuditResource.skip = 0;
    this.loadResponseAuditTrails();
  }

  onTypeChange(event: any) {
    if (event) {
      this.responseAuditResource.responseType = event.id;
    } else {
      this.responseAuditResource.responseType = 'all';
    }
    this.responseAuditResource.skip = 0;
    this.loadResponseAuditTrails();
  }

  onActionChange(event: any) {
    if (event) {
      this.responseAuditResource.operation = event.id;
    } else {
      this.responseAuditResource.operation = '';
    }
    this.responseAuditResource.skip = 0;
    this.loadResponseAuditTrails();
  }

  onDateChange(event: any) {
    if (event) {
      const date = new Date(event);
      this.responseAuditResource.dateFrom = date.toISOString().split('T')[0] + ' 00:00:00';
      this.responseAuditResource.dateTo = date.toISOString().split('T')[0] + ' 23:59:59';
    } else {
      this.responseAuditResource.dateFrom = '';
      this.responseAuditResource.dateTo = '';
    }
    this.responseAuditResource.skip = 0;
    this.loadResponseAuditTrails();
  }
}
