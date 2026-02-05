import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumCategoryService } from '../forum-category/forum-category.service';
import { ForumService } from '../forum.service';
import { SecurityService } from '@app/core/security/security.service';
import { User } from '@app/shared/enums/user-auth';

@Component({
  selector: 'app-forum-edit',
  templateUrl: './forum-edit.component.html',
  styleUrls: ['./forum-edit.component.css']
})
export class ForumEditComponent implements OnInit {

  forumForm: FormGroup;
  categories = []
  forumId = null
  currentUser: any
  userId

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private forumService:ForumService,
    private router: Router,
    private forumCategoryService: ForumCategoryService,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
  ) {
    this.currentUser = this.securityService.getUserDetail().user;
  }

  ngOnInit(): void {
    this.createArticleForm()
    this.getForumCategories()
    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')
      this.forumId = id
      if(id) {
        this.forumService.getForum(id).subscribe(
          (data:any)=>{
            this.forumForm.patchValue({
              title:data.title,
              category:data.category.id,
              content:data.content,
              closed:data.closed,
              tags:data.tags.map((tag:any)=>{ return {label:tag.metatag} }),
              private:data.privacy=='private'?true:false,
            })
            this.userId = data.creator.id
            this.cdr.markForCheck()
          }
        )
      }
    })
  }

  createArticleForm() {
    this.forumForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subCategory: ['', []],
      content: ['', [Validators.required]],
      tags: [[], []],
      closed:[false],
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

      this.forumService.updateForum(this.forumId, this.forumForm.value).subscribe(
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
