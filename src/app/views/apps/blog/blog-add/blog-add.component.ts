import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { BlogService } from '../blog.service';
import { BlogCategoryService } from '../blog-category/blog-category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-add',
  templateUrl: './blog-add.component.html',
  styleUrls: ['./blog-add.component.scss']
})
export class BlogAddComponent implements OnInit {

  blogForm: FormGroup;
  picture: SafeUrl
  newPicture: SafeUrl
  minDate = new Date();
  categories = []

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private blogService:BlogService,
    private router: Router,
    private blogCategoryService: BlogCategoryService,
  ) { }

  ngOnInit(): void {
    this.createArticleForm()
    this.getBlogCategories()
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
      picture: ['', [Validators.required]],
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

      this.blogService.addBlog(this.blogForm.value).subscribe(
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
