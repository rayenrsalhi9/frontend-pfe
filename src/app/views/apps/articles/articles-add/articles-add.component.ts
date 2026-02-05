import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleCategoryService } from '@app/shared/services/article-category.service';
import { ArticleService } from '@app/shared/services/article.service';
import { CommonService } from '@app/shared/services/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from '@app/core/security/security.service';

@Component({
  selector: 'app-articles-add',
  templateUrl: './articles-add.component.html',
  styleUrls: ['./articles-add.component.css']
})
export class ArticlesAddComponent implements OnInit {

  message: string = ''
  showMessage: boolean = false
  status: 'success' | 'fail' | '' = ''
  fileList: any[] = []
  articleForm: FormGroup;
  users:any[];
  categories:any[]
  isEdit:boolean = false
  articleId:any

  currentUser:any

  picture: SafeUrl
  newPicture: string = null

  constructor(
    private fb: FormBuilder,
    private commonService:CommonService,
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastrService:ToastrService
  ) {

  }

  getHost() {
    return environment.apiUrl
  }


  ngOnInit() {

    this.currentUser = this.securityService.getUserDetail().user;

    console.log(this.currentUser);



    this.fileList = []
    this.createArticleForm()
    this.getCategories()
    this.getUsers()

    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')
      this.articleId = id
      if(id) {
        this.isEdit = true
        this.articleService.getArticle(id).subscribe(
          (data:any)=>{
            this.articleForm.patchValue({
              title:data.title,
              category:data.category.id,
              description:data.shortText,
              body:data.longText,
              private:data.privacy=='private'?true:false,
              users:data.users.filter(((usr:any)=>usr.user.id != this.currentUser.id)).map((usr:any)=>usr.user.id),
              picture:null
            })
            this.picture = data.picture ? (data.picture.startsWith("data:image") ? data.picture : this.getHost() + data.picture) : null
            this.cdr.markForCheck()
          }
        )
      }
    })
  }

  createArticleForm() {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      body: ['', [Validators.required]],
      private: [false],
      users: [[]],
      picture: ['', [Validators.required]],
    });
  }

  handleAddPicture(event) {

  }

  getUsers() {
    this.commonService.getUsers().subscribe(
      (data:any)=>{
        this.users = data.filter((user:any)=>user.id != this.currentUser.id)
      }
    )
  }

  getCategories() {
    this.articleCategoryService.allCategories().subscribe(
      (data:any)=>{
        this.categories = data
      }
    )
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
      this.articleForm.patchValue({
        picture: reader.result.toString()
      })
      this.newPicture = reader.result.toString()
      this.cdr.detectChanges()
    }

  }

  saveArticle() {

    if(this.isEdit) {
      this.articleService.updateArticle(this.articleId, {...this.articleForm.value, users:[...this.articleForm.value.users,this.currentUser.id]}).subscribe(
        (data:any)=>{
          this.translate.get('ARTICLES.ADD.TOAST.UPDATED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage);
          });
          this.router.navigate(['/apps/news']);
        }
        )
      } else {
        if (this.articleForm.valid) {


          this.articleService.addArticle({...this.articleForm.value, users:[...this.articleForm.value.users,this.currentUser.id]}).subscribe(
            (data:any)=>{
              this.translate.get('ARTICLES.ADD.TOAST.ADDED_SUCCESS').subscribe((translatedMessage: string) => {
                this.toastrService.success(translatedMessage);
              });
              this.router.navigate(['/apps/news']);
          }
        )
        } else {
          this.articleForm.markAllAsTouched();
        }
    }
  }


}
