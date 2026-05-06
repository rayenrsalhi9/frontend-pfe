import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Directive()
export class AppFormBase implements OnDestroy {
  protected destroy$ = new Subject<void>();
  isLoading = false;
  isEdit = false;
  isSubmitted = false;
  
  // Common form fields
  users: any[] = [];
  categories: any[] = [];
  articleId: any; // Used as generic ID in some cases
  currentUser: any;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Universal field validation check
   */
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.isSubmitted));
  }

  /**
   * ng-select comparison function for User objects
   */
  compareUsersById(a: any, b: any): boolean {
    return a?.id === b?.id;
  }

  /**
   * Generic category change handler
   */
  onCategoryChange(form: FormGroup, categoryId: string | number): void {
    if (categoryId) {
      form.get('category')?.setValue(categoryId);
      form.get('category')?.markAsDirty();
    }
  }
}
