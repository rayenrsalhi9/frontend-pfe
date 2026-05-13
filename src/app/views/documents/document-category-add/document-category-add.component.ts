import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { CategoryService } from "@app/shared/services/category.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-document-category-add",
  templateUrl: "./document-category-add.component.html",
  styleUrls: ["./document-category-add.component.scss"],
})
export class DocumentCategoryAddComponent implements OnInit, OnDestroy {
  categoryManage: FormGroup;
  isEdit = false;
  isLoading = false;
  isSubmitted = false;
  data: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.data && this.data.id) {
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

  patchForm(values: any) {
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

  onCancel(): void {
    this.bsModalRef.hide();
  }

  saveCategory(): void {
    this.isSubmitted = true;
    if (this.categoryManage.valid) {
      this.isLoading = true;
      const payload = { ...this.categoryManage.value, id: this.data.id };
      const request = this.isEdit
        ? this.categoryService.update(payload)
        : this.categoryService.add(this.categoryManage.value);

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
          console.error("Error saving document category:", err);
        },
      });
    } else {
      this.categoryManage.markAllAsTouched();
      this.toastr.warning(
        this.translate.instant("ADD.SHARED.ERRORS.VALIDATION_ERROR"),
      );
    }
  }
}
