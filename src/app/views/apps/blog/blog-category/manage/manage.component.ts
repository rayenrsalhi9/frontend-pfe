import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { BlogCategoryService } from "../blog-category.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit, OnDestroy {
  categoryManage: FormGroup;
  data: any = null;
  isEdit = false;
  isLoading = false;
  isSubmitted = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private bsModalRef: BsModalRef,
    private blogCategoryService: BlogCategoryService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.data && Object.keys(this.data).length > 0) {
      this.patchForm(this.data);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm() {
    this.categoryManage = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", []],
    });
  }

  patchForm(values) {
    this.categoryManage.patchValue({
      name: values.name,
      description: values.description,
    });
    this.isEdit = true;
    this.cdr.markForCheck();
  }

  get isNameInvalid() {
    const ctrl = this.categoryManage.get("name");
    return ctrl && ctrl.invalid && (ctrl.dirty || this.isSubmitted);
  }

  saveCategory() {
    this.isSubmitted = true;
    if (this.categoryManage.valid) {
      this.isLoading = true;
      const request = this.isEdit
        ? this.blogCategoryService.updateCategory(
            this.data.id,
            this.categoryManage.value,
          )
        : this.blogCategoryService.addCategory(this.categoryManage.value);

      request.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.isLoading = false;
          const toastKey = this.isEdit
            ? "EDIT.CATEGORY.TOAST.SUCCESS"
            : "ADD.CATEGORY.TOAST.SUCCESS";
          this.toastr.success(this.translate.instant(toastKey));
          this.bsModalRef.hide();
        },
        error: (err) => {
          this.isLoading = false;
          const toastKey = this.isEdit
            ? "EDIT.CATEGORY.TOAST.ERROR"
            : "ADD.CATEGORY.TOAST.ERROR";
          this.toastr.error(this.translate.instant(toastKey));
          console.error("Error saving category:", err);
        },
      });
    } else {
      this.categoryManage.markAllAsTouched();
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
