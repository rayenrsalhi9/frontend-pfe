import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '@app/shared/services/category.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DocumentCategoryAddComponent } from '../document-category-add/document-category-add.component';
import { ToastrService } from 'ngx-toastr';
import { Category } from '@app/shared/enums/category';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core'; 
@Component({
  selector: 'app-document-categories',
  templateUrl: './document-categories.component.html',
  styleUrls: ['./document-categories.component.css']
})
export class DocumentCategoriesComponent implements OnInit {

  showMobilePanel = false

  rows: any[] = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  bsModalRef: BsModalRef;

  constructor(
    private categoryService:CategoryService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private toastrService:ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getCategories()
  }

  addCategory(){
    this.modalService.show(DocumentCategoryAddComponent,{})
  }

  ngAfterViewInit() {
    this.cellOverflowVisible();
  }

  getCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (response:any)=>{
        this.rows = response
        this.cdr.detectChanges()
      },
      (error:any)=>{

      }
    );
  }

  deleteCategory(id: string): void {

    this.translate.get('CATEGORY.DELETE.LABEL').subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm
          }
        }
      });
    }); 
    this.bsModalRef.content.onClose.subscribe(result => {

      if(result) {
        this.categoryService.delete(id).subscribe((d) => {
          this.translate.get('CATEGORY.DELETE.TOAST.CATEGORY_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); // Display translated message using Toastr
          }); 
          this.getCategories();
        });
      }
    
    })

  }

  manageCategory(category: Category): void {
    const initialState = {
      width: '350px',
      data: Object.assign({}, category),
    }
    const dialogRef = this.modalService.show(DocumentCategoryAddComponent, {
      initialState
    });

    dialogRef.onHide.subscribe(()=>{
      this.getCategories()
    })
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
