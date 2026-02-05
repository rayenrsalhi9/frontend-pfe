import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonError } from '@app/core/error-handler/common-error';
import { DocumentResource } from '@app/shared/enums/document-resource';
import { User } from '@app/shared/enums/user-auth';
import { CategoryService } from '@app/shared/services/category.service';
import { CommonService } from '@app/shared/services/common.service';
import { DocumentAuditTrailService } from '@app/shared/services/document-audit-trail.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-document-audits-trail',
  templateUrl: './document-audits-trail.component.html',
  styleUrls: ['./document-audits-trail.component.css']
})
export class DocumentAuditsTrailComponent implements OnInit {

  showMobilePanel = false

  rows:any[]
  users:any[]
  categories:any[]

  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  documentResource: DocumentResource;

  constructor(
    private documentAuditTrailService:DocumentAuditTrailService,
    private cdr:ChangeDetectorRef,
    private commonService: CommonService,
    private categoryService:CategoryService,
  ) {
    this.documentResource = new DocumentResource();
    this.documentResource.orderBy = "createdDate desc"
   }

  ngOnInit() {
    this.loadDocuments()
    this.getUsers()
    this.getCategories()
  }

  ngAfterViewInit() {
    this.cellOverflowVisible();
  }

  loadDocuments(data = this.documentResource) {
    this.documentAuditTrailService.getDocumentAuditTrials(data).subscribe(
      (res: HttpResponse<any>) => {
        this.rows = res.body
        this.cdr.detectChanges();
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  getUsers(): void {
    this.commonService.getUsersForDropdown().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (err: CommonError) => {
      }
    );
  }

  getCategories(): void {
    this.categoryService.getAllCategoriesForDropDown().subscribe((c) => {
      this.categories = c;
    });
  }

  onNameChange(event:any) {
    let val = event.target.value
    if (val) {
      this.documentResource.name = val;
    } else {
      this.documentResource.name = '';
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  onCategoryChange(event: any) {
    if (event) {
      this.documentResource.categoryId = event;
    } else {
      this.documentResource.categoryId = '';
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  onUserChange(event: any) {
    if (event) {
      this.documentResource.createdBy = event;
    } else {
      this.documentResource.createdBy = '';
    }
    this.documentResource.skip = 0;
    this.loadDocuments(this.documentResource);
  }

  private cellOverflowVisible() {
    const cells = document.getElementsByClassName('datatable-body-cell overflow-visible');

    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].setAttribute('style', 'overflow: visible !important');
    }
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

}
