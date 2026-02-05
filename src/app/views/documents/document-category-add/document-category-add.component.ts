import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CategoryService } from '@app/shared/services/category.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-document-category-add',
  templateUrl: './document-category-add.component.html',
  styleUrls: ['./document-category-add.component.css']
})
export class DocumentCategoryAddComponent implements OnInit {

  isEdit = false;
  width:any
  data:any
  constructor(
    private categoryService: CategoryService,
    public bsModalRef: BsModalRef,
  ) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data.id) {
        this.isEdit = true;
      }
    }
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }

  saveCategory(): void {
    if (this.data.id) {
      this.categoryService.update(this.data).subscribe((c) => {
        this.bsModalRef.hide();
      });
    } else {
      this.categoryService.add(this.data).subscribe((c) => {
        this.bsModalRef.hide();
      });
    }
  }
}
