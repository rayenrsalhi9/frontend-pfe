import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogCategoryService } from '../blog-category/blog-category.service';
import { BlogService } from '../blog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css']
})
export class BlogEditComponent implements OnInit {

  blogForm: FormGroup;
  picture: SafeUrl
  newPicture: SafeUrl
  minDate = new Date();
  categories = []
  blogId = null

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private blogService:BlogService,
    private router: Router,
    private blogCategoryService: BlogCategoryService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.createArticleForm()
    this.getBlogCategories()
    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')
      this.blogId = id
      if(id) {
        this.blogService.getBlog(id).subscribe(
          (data:any)=>{
            this.blogForm.patchValue({
              title:data.title,
              subtitle:data.subtitle,
              category:data.category.id,
              banner:data.banner,
              expiration:data.expiration,
              startDate:data.endDate?new Date(data.startDate):null,
              endDate:data.endDate?new Date(data.endDate):null,
              body:data.body,
              tags:data.tags.map((tag:any)=>{ return {label:tag.metatag} }),
              private:data.privacy=='private'?true:false,
              picture:null
            })
            this.picture = data.picture ? (data.picture.startsWith("data:image") ? data.picture : this.getHost() + data.picture) : null
            this.cdr.markForCheck()
          }
        )
      }
    })
  }

  getHost() {
    return environment.apiUrl
  }

  getBlogCategories() {
    this.blogCategoryService.allCategories().subscribe(
      (data:any)=>{
        this.categories = data
        this.cdr.markForCheck()
      },
      error=>{

      }
    )
  }

  createArticleForm() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      subtitle: ['', [Validators.required]],
      body: ['', [Validators.required]],
      category: ['', [Validators.required]],
      private: [false],
      tags: [[]],
      users: [[]],
      expiration:[false],
      banner:[false],
      startDate: ['', []],
      endDate: ['', []],
      picture: ['', []],
    });
  }

  onFileSelect(event) {

    const fileSelected: File = event.target.files[0];
    if (!fileSelected) {
      return;
    }
    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    reader.onload = (_event) => {
      this.picture = reader.result;
      this.blogForm.patchValue({
        picture: reader.result.toString()
      })
      this.newPicture = reader.result.toString()
      this.cdr.detectChanges()
    }

  }

  blogSave() {



    if (this.blogForm.valid) {

      this.blogService.updateBlog(this.blogId,this.blogForm.value).subscribe(
        (data:any)=>{
          console.log(data);
          this.router.navigate(['/apps/blogs']);
        },
        (error:any)=> {
          console.log(error);
        }
      )



    } else {
      this.blogForm.markAllAsTouched();
    }
  }

}
