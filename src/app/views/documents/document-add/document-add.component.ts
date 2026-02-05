import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '@app/shared/enums/category';
import { DocumentAuditTrail } from '@app/shared/enums/document-audit-trail';
import { DocumentInfo } from '@app/shared/enums/document-info';
import { DocumentOperation } from '@app/shared/enums/document-operation';
import { DocumentMetaData } from '@app/shared/enums/documentMetaData';
import { FileInfo } from '@app/shared/enums/file-info';
import { Role } from '@app/shared/enums/role';
import { User } from '@app/shared/enums/user-auth';
import { CategoryService } from '@app/shared/services/category.service';
import { CommonService } from '@app/shared/services/common.service';
import { DocumentService } from '@app/shared/services/document.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-document-add',
  templateUrl: './document-add.component.html',
  styleUrls: ['./document-add.component.css']
})

export class DocumentAddComponent implements OnInit {

  document: DocumentInfo;
  documentForm: FormGroup;
  extension = '';
  categories: Category[] = [];
  allCategories: Category[] = [];
  @Input() loading: boolean;
  isLoading: boolean;
  documentSource: string;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaveDocument: EventEmitter<DocumentInfo> = new EventEmitter<DocumentInfo>();
  progress = 0;
  message = '';
  fileInfo: FileInfo;
  isFileUpload = false;
  fileData: any;
  users: User[];
  roles: Role[];
  selectedRoles: Role[] = [];
  selectedUsers: User[] = [];
  minDate: Date;
  get documentMetaTagsArray(): FormArray {
    return <FormArray>this.documentForm.get('documentMetaTags');
  }

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private cd: ChangeDetectorRef,
    private categoryService: CategoryService,
    private commonService: CommonService,
    private documentService: DocumentService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.createDocumentForm();
    this.getCategories();
    this.documentMetaTagsArray.push(this.buildDocumentMetaTag());
    this.getUsers();
    this.getRoles();
  }

  getUsers() {
    this.commonService
      .getUsersForDropdown()
      .subscribe((users: User[]) => (this.users = users));
  }

  selectRole(event: any) {
    this.selectedRoles = event
  }

  selectUser(event: any) {

    console.log(event);

    if(event[0] == 'all') {
      this.selectedUsers = this.users
    } else {
      this.selectedUsers = event
    }
  }

  public onSelectAll() {
    this.selectedUsers = this.users
    console.log(this.selectedUsers);
  }

  public onClearAll() {
    //this.form.get('example').patchValue([]);
  }


  getRoles() {
    this.commonService
      .getRolesForDropdown()
      .subscribe((roles: Role[]) => (this.roles = roles));
  }

  getCategories() {
    this.categoryService.getAllCategoriesForDropDown().subscribe((c) => {
      this.categories = c;
      this.setDeafLevel();
    });
  }

  setDeafLevel(parent?: Category, parentId?: string) {
    const children = this.categories.filter((c) => c.parentId == parentId);
    if (children.length > 0) {
      children.map((c, index) => {
        c.deafLevel = parent ? parent.deafLevel + 1 : 0;
        c.index =
          (parent ? parent.index : 0) + index * Math.pow(0.1, c.deafLevel);
        this.allCategories.push(c);
        this.setDeafLevel(c, c.id);
      });
    }
    return parent;
  }

  onDocumentChange($event: any) {
    const files = $event.target.files || $event.srcElement.files;
    const file_url = files[0];
    this.extension = file_url.name.split('.').pop();
    if (this.fileExtesionValidation(this.extension)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.documentSource = e.target.result;
        this.fileUploadValidation('upload');
      };
      reader.readAsDataURL(file_url);
    } else {
      this.documentSource = null;
      this.fileUploadValidation('');
    }
  }

  fileUploadValidation(fileName: string) {
    this.documentForm.patchValue({
      url: fileName,
    });
    this.documentForm.get('url').markAsTouched();
    this.documentForm.updateValueAndValidity();
  }

  fileUploadExtensionValidation(extension: string) {
    this.documentForm.patchValue({
      extension: extension,
    });
    this.documentForm.get('extension').markAsTouched();
    this.documentForm.updateValueAndValidity();
  }

  fileExtesionValidation(extesion: string): boolean {
    const allowExtesions = environment.allowExtesions;
    const allowTypeExtenstion = allowExtesions.find((c) =>
      c.extentions.find((ext) => ext === extesion)
    );
    return allowTypeExtenstion ? true : false;
  }

  createDocumentForm() {
    this.documentForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      categoryId: ['', [Validators.required]],
      url: [''],
      extension: ['', [Validators.required]],
      documentMetaTags: this.fb.array([]),
      selectedRoles: [],
      selectedUsers: [],
      rolePermissionForm: this.fb.group({
        isTimeBound: new FormControl(false),
        startDate: [''],
        endDate: [''],
        isAllowDownload: new FormControl(false),
      }),
      userPermissionForm: this.fb.group({
        isTimeBound: new FormControl(false),
        startDate: [''],
        endDate: [''],
        isAllowDownload: new FormControl(false),
      }),
    });
  }

  buildDocumentMetaTag(): FormGroup {
    return this.fb.group({
      id: [''],
      documentId: [''],
      metatag: [''],
    });
  }

  get rolePermissionFormGroup() {
    return this.documentForm.get('rolePermissionForm') as FormGroup;
  }

  get userPermissionFormGroup() {
    return this.documentForm.get('userPermissionForm') as FormGroup;
  }

  onMetatagChange(event: any, index: number) {
    const email = this.documentMetaTagsArray.at(index).get('metatag').value;
    if (!email) {
      return;
    }
    const emailControl = this.documentMetaTagsArray.at(index).get('metatag');
    emailControl.setValidators([Validators.required]);
    emailControl.updateValueAndValidity();
  }

  editDocmentMetaData(documentMetatag: DocumentMetaData): FormGroup {
    return this.fb.group({
      id: [documentMetatag.id],
      documentId: [documentMetatag.documentId],
      metatag: [documentMetatag.metatag],
    });
  }

  /* SaveDocument() {
    if (this.documentForm.valid) {
      this.onSaveDocument.emit(this.buildDocumentObject());
    } else {
      this.documentForm.markAllAsTouched();
    }
  } */



  SaveDocument() {
    this.isLoading = true;
    const doc = this.buildDocumentObject();
    this.documentService.addDocument(doc).subscribe(
      (documentInfo: DocumentInfo) => {
        this.translate.get('DOCUMENTS.ADD.TOAST.DOCUMENT_SAVE_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastr.success(translatedMessage);
        });
        this.isLoading = false;
        this.addDocumentTrail(documentInfo);
        this.router.navigate(['/document/list'])
      },
      () => (this.isLoading = false)
    );
  }

  addDocument() {
    if (this.documentForm.valid) {
      const doc = this.buildDocumentObject();
      this.documentService.addDocument(doc).subscribe((documentInfo) => {
        this.addDocumentTrail(documentInfo);
        this.translate.get('DOCUMENTS.ADD.TOAST.DOCUMENT_SAVE_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastr.success(translatedMessage);
        });
        this.router.navigate(['/document/assigned'])
      });
      this;
    } else {
      this.documentForm.markAllAsTouched();
    }
  }

  addDocumentTrail(id) {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: id,
      operationName: DocumentOperation.Created.toString(),
    };
    this.commonService
      .addDocumentAuditTrail(objDocumentAuditTrail)
      .subscribe((c) => {

      });
  }

  buildDocumentObject(): DocumentInfo {
    const documentMetaTags = this.documentMetaTagsArray.getRawValue();

    const document: DocumentInfo = {
      categoryId: this.documentForm.get('categoryId').value,
      description: this.documentForm.get('description').value,
      name: this.documentForm.get('name').value,
      url: this.fileData.fileName,
      documentMetaDatas: [...documentMetaTags],
      fileData: this.fileData
    };
    if (this.selectedRoles.length > 0) {
      document.documentRolePermissions = this.selectedRoles.map((role) => {
        return Object.assign(
          {},
          {
            id: '',
            documentId: '',
            roleId: role.id,
          },
          this.rolePermissionFormGroup.value
        );
      });
    }

    if (this.selectedUsers.length > 0) {
      document.documentUserPermissions = this.selectedUsers.map((user) => {
        return Object.assign(
          {},
          {
            id: '',
            documentId: '',
            userId: user.id,
          },
          this.userPermissionFormGroup.value
        );
      });
    }
    return document;
  }

  onAddAnotherMetaTag() {
    const documentMetaTag: DocumentMetaData = {
      id: '',
      documentId: this.document && this.document.id ? this.document.id : '',
      metatag: '',
    };
    this.documentMetaTagsArray.insert(
      0,
      this.editDocmentMetaData(documentMetaTag)
    );
  }

  onDeleteMetaTag(index: number) {
    this.documentMetaTagsArray.removeAt(index);
  }

  upload(files) {
    if (files.length === 0) return;
    this.extension = files[0].name.split('.').pop();
    if (!this.fileExtesionValidation(this.extension)) {
      this.fileUploadExtensionValidation('');
      this.cd.markForCheck();
      return;
    } else {
      this.fileUploadExtensionValidation('valid');
    }

    this.fileData = files[0];
    this.documentForm.get('url').setValue(files[0].name);
    this.documentForm.get('name').setValue(files[0].name);
  }

  roleTimeBoundChange(event: any) {
    if (event.checked) {
      this.rolePermissionFormGroup
        .get('startDate')
        .setValidators([Validators.required]);
      this.rolePermissionFormGroup
        .get('endDate')
        .setValidators([Validators.required]);
    } else {
      this.rolePermissionFormGroup.get('startDate').clearValidators();
      this.rolePermissionFormGroup.get('startDate').updateValueAndValidity();
      this.rolePermissionFormGroup.get('endDate').clearValidators();
      this.rolePermissionFormGroup.get('endDate').updateValueAndValidity();
    }
  }

  userTimeBoundChange(event: any) {
    if (event.checked) {
      this.userPermissionFormGroup
        .get('startDate')
        .setValidators([Validators.required]);
      this.userPermissionFormGroup
        .get('endDate')
        .setValidators([Validators.required]);
    } else {
      this.userPermissionFormGroup.get('startDate').clearValidators();
      this.userPermissionFormGroup.get('startDate').updateValueAndValidity();
      this.userPermissionFormGroup.get('endDate').clearValidators();
      this.userPermissionFormGroup.get('endDate').updateValueAndValidity();
    }
  }

}
