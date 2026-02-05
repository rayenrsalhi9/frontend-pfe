import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ArticleCategoryService } from '@app/shared/services/article-category.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-articles-category-add',
  templateUrl: './articles-category-add.component.html',
  styleUrls: ['./articles-category-add.component.css']
})
export class ArticlesCategoryAddComponent implements OnInit {

  isEdit = false;
  width:any
  data:any
  constructor(
    private articleCategoryService: ArticleCategoryService,
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
      this.articleCategoryService.updateCategpry(this.data.id, this.data).subscribe((c) => {
        this.bsModalRef.hide();

      });
    } else {
      this.articleCategoryService.addCategory(this.data).subscribe((c) => {
        this.bsModalRef.hide();
      });
    }
  }

}
