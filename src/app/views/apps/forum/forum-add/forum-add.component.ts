import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ForumService } from '../forum.service';
import { ForumCategoryService } from '../forum-category/forum-category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum-add',
  templateUrl: './forum-add.component.html',
  styleUrls: ['./forum-add.component.css']
})
export class ForumAddComponent implements OnInit {

  forumForm: FormGroup;
  categories = []

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private forumService:ForumService,
    private router: Router,
    private forumCategoryService: ForumCategoryService,
  ) { }

  ngOnInit(): void {
    this.createArticleForm()
    this.getForumCategories()
  }

  createArticleForm() {
    this.forumForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subCategory: ['', []],
      content: ['', [Validators.required]],
      tags: [[], []],
      private: [false],
    });
  }

  getForumCategories() {
    this.forumCategoryService.allCategories().subscribe(
      (data:any)=>{
        this.categories = data
        this.cdr.markForCheck()
      },
      error=>{

      }
    )
  }

  forumSave() {



    if (this.forumForm.valid) {

      this.forumService.addForum(this.forumForm.value).subscribe(
        (data:any)=>{
          console.log(data);
          this.router.navigate(['/apps/forums']);
        },
        (error:any)=> {
          console.log(error);
        }
      )



    } else {
      this.forumForm.markAllAsTouched();
    }
  }

}
