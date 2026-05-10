import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-category-manage-form",
  templateUrl: "./category-manage-form.component.html",
})
export class CategoryManageFormComponent {
  @Input() isEdit = false;
  @Input() isLoading = false;
  @Input() formGroup!: FormGroup;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get isNameInvalid(): boolean {
    const ctrl = this.formGroup?.get("name");
    return ctrl ? ctrl.invalid && (ctrl.dirty || ctrl.touched) : false;
  }
}
