import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { CommonError } from '@app/core/error-handler/common-error';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ForgotFormComponent } from './forgot-form.component';
import { TranslatePipeMock } from '@app/testing/mock.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ForgotFormComponent', () => {
  let component: ForgotFormComponent;
  let fixture: ComponentFixture<ForgotFormComponent>;
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    securityServiceSpy = jasmine.createSpyObj('SecurityService', ['forgot']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      declarations: [ForgotFormComponent, TranslatePipeMock],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: SecurityService, useValue: securityServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: translateSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should have email control', () => {
      expect(component.formGroup.get('email')).toBeTruthy();
    });

    it('should be invalid when email is empty', () => {
      expect(component.formGroup.valid).toBeFalse();
    });
  });

  describe('email validation', () => {
    it('should be required', () => {
      const email = component.formGroup.get('email');
      email?.setValue('');
      expect(email?.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const email = component.formGroup.get('email');
      email?.setValue('notanemail');
      expect(email?.errors?.['email']).toBeTruthy();
    });

    it('should accept valid email', () => {
      const email = component.formGroup.get('email');
      email?.setValue('user@example.com');
      expect(email?.valid).toBeTrue();
    });
  });

  describe('submit button', () => {
    it('should be disabled when loading', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.lf-submit-btn');
      expect(button.disabled).toBeTrue();
    });

    it('should show spinner when loading', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('.icon-loader');
      expect(spinner).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    it('should sanitize email (trim and lowercase) before sending', () => {
      securityServiceSpy.forgot.and.returnValue(of({}));

      component.formGroup.get('email')?.setValue('Test@Example.COM');
      component.onSubmit();

      expect(securityServiceSpy.forgot).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
    });

    it('should navigate to verify page on success', fakeAsync(() => {
      securityServiceSpy.forgot.and.returnValue(of({}));

      component.formGroup.get('email')?.setValue('test@example.com');
      component.onSubmit();
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/verify/test%40example.com']);
    }));

    it('should show success toast on success', fakeAsync(() => {
      securityServiceSpy.forgot.and.returnValue(of({}));

      component.formGroup.get('email')?.setValue('test@example.com');
      component.onSubmit();
      tick();

      expect(toastrSpy.success).toHaveBeenCalledWith('SIGN.FORGOT.SUCCESS');
    }));

    it('should display error message on failure', fakeAsync(() => {
      const err: CommonError = {
        statusText: 'Error',
        messages: ['Not found'],
        friendlyMessage: 'Error',
        error: { message: 'This email does not exist' }
      };
      securityServiceSpy.forgot.and.returnValue(throwError(err));

      component.formGroup.get('email')?.setValue('unknown@example.com');
      component.onSubmit();
      tick();

      expect(component.errorMessage).toBe('This email does not exist');
      expect(toastrSpy.error).toHaveBeenCalledWith('This email does not exist');
    }));

    it('should not submit if form is invalid', () => {
      component.formGroup.get('email')?.setValue('');
      component.onSubmit();

      expect(securityServiceSpy.forgot).not.toHaveBeenCalled();
    });

    it('should show error alert when errorMessage is set', fakeAsync(() => {
      const err: CommonError = {
        statusText: 'Error',
        messages: ['Not found'],
        friendlyMessage: 'Error',
        error: { message: 'Email not found' }
      };
      securityServiceSpy.forgot.and.returnValue(throwError(err));

      component.formGroup.get('email')?.setValue('test@example.com');
      component.onSubmit();
      tick();
      fixture.detectChanges();

      const alert = fixture.nativeElement.querySelector('.lf-alert');
      expect(alert).toBeTruthy();
    }));
  });

  describe('form reset', () => {
    it('should reset form and clear state', () => {
      component.formGroup.get('email')?.setValue('test@example.com');
      component.errorMessage = 'Some error';
      component.submitted = true;

      component.onReset();

      expect(component.formGroup.get('email')?.value).toBeNull();
      expect(component.errorMessage).toBeNull();
      expect(component.submitted).toBeFalse();
    });
  });

  describe('visual design', () => {
    it('should use the same CSS classes as login form', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form.classList.contains('lf-form')).toBeTrue();

      const submitBtn = fixture.nativeElement.querySelector('.lf-submit-btn');
      expect(submitBtn).toBeTruthy();
    });
  });
});
