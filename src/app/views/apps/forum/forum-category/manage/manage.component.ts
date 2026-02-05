import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ForumCategoryService } from '../forum-category.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  categoryManage: FormGroup;
  data:any = null
  isEdit = false

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private bsModalRef: BsModalRef,
    private forumCategoryService: ForumCategoryService,
  ) { }

  ngOnInit(): void {
    this.createForm()

    if(Object.keys(this.data).length > 0){
      this.patchForm(this.data)
    }
  }

  createForm() {
    this.categoryManage = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', []]
    });
  }

  patchForm(values) {
    this.categoryManage.patchValue({
      name:values.name,
      description:values.description
    })
    this.isEdit = true
    this.cdr.markForCheck()
  }


  saveCategory() {
    if (this.categoryManage.valid) {

      if(this.isEdit) {

        this.forumCategoryService.updateCategory(this.data.id,this.categoryManage.value).subscribe(
          data=>{
            console.log(data);
            this.bsModalRef.hide();
          }
        )

      } else {
        this.forumCategoryService.addCategory(this.categoryManage.value).subscribe(
          data=>{
            console.log(data);
            this.bsModalRef.hide();
          }
        )
      }
    } else {
      this.categoryManage.markAllAsTouched();
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }


}
