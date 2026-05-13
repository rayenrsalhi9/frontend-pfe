import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { CommonError } from '@app/core/error-handler/common-error';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError, Subject } from 'rxjs';
import { ResetPasswordComponent } from './reset-password.component';
import { TranslatePipeMock } from '@app/testing/mock.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let paramMapSubject: Subject<any>;

  const validPassword = 'Test@1234';

  beforeEach(async () => {
    securityServiceSpy = jasmine.createSpyObj('SecurityService', ['reset']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.callFake((key: string) => key);
    paramMapSubject = new Subject();

    const activatedRouteStub = {
      paramMap: paramMapSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent, TranslatePipeMock],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: SecurityService, useValue: securityServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should have email, password, confirmPassword, and token controls', () => {
      expect(component.formGroup.get('email')).toBeTruthy();
      expect(component.formGroup.get('password')).toBeTruthy();
      expect(component.formGroup.get('confirmPassword')).toBeTruthy();
      expect(component.formGroup.get('token')).toBeTruthy();
    });

    it('should be invalid when empty', () => {
      expect(component.formGroup.valid).toBeFalse();
    });
  });

  describe('route params', () => {
    it('should populate email and token from route params', fakeAsync(() => {
      paramMapSubject.next({
        get: (key: string) => {
          if (key === 'token') return 'reset-token-123';
          if (key === 'email') return 'test@example.com';
          return null;
        }
      });
      tick();

      expect(component.formGroup.get('email')?.value).toBe('test@example.com');
      expect(component.formGroup.get('token')?.value).toBe('reset-token-123');
    }));

    it('should navigate to login if no token in route', fakeAsync(() => {
      paramMapSubject.next({ get: () => null });
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

  describe('password validation', () => {
    it('should be required', () => {
      const password = component.formGroup.get('password');
      password?.setValue('');
      expect(password?.errors?.['required']).toBeTruthy();
    });

    it('should be invalid without uppercase letter', () => {
      const password = component.formGroup.get('password');
      password?.setValue('test@1234');
      expect(password?.valid).toBeFalse();
    });

    it('should be invalid without special character', () => {
      const password = component.formGroup.get('password');
      password?.setValue('TestA1234');
      expect(password?.valid).toBeFalse();
    });

    it('should be invalid without number', () => {
      const password = component.formGroup.get('password');
      password?.setValue('Test@abcd');
      expect(password?.valid).toBeFalse();
    });

    it('should be invalid with less than 8 characters', () => {
      const password = component.formGroup.get('password');
      password?.setValue('Te@1');
      expect(password?.valid).toBeFalse();
    });

    it('should be valid with all password requirements met', () => {
      const password = component.formGroup.get('password');
      password?.setValue(validPassword);
      expect(password?.valid).toBeTrue();
    });
  });

  describe('confirm password validation', () => {
    it('should show mismatch error when passwords do not match', () => {
      component.formGroup.get('password')?.setValue(validPassword);
      component.formGroup.get('confirmPassword')?.setValue('Different@123');
      component.submitted = true;
      fixture.detectChanges();

      expect(component.formGroup.hasError('mismatch')).toBeTrue();
    });

    it('should be valid when passwords match', () => {
      component.formGroup.get('password')?.setValue(validPassword);
      component.formGroup.get('confirmPassword')?.setValue(validPassword);
      component.submitted = true;

      expect(component.formGroup.hasError('mismatch')).toBeFalse();
    });
  });

  describe('password requirement helpers', () => {
    it('hasUpperCase should detect uppercase', () => {
      expect(component.hasUpperCase('Test')).toBeTrue();
      expect(component.hasUpperCase('test')).toBeFalse();
    });

    it('hasSpecialChar should detect special characters', () => {
      expect(component.hasSpecialChar('Test@123')).toBeTrue();
      expect(component.hasSpecialChar('Test123')).toBeFalse();
    });

    it('hasNumber should detect digits', () => {
      expect(component.hasNumber('Test@123')).toBeTrue();
      expect(component.hasNumber('Test@Test')).toBeFalse();
    });

    it('hasMinLength should check length', () => {
      expect(component.hasMinLength('12345678')).toBeTrue();
      expect(component.hasMinLength('1234567')).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      paramMapSubject.next({
        get: (key: string) => {
          if (key === 'token') return 'reset-token-123';
          if (key === 'email') return 'test@example.com';
          return null;
        }
      });
      fixture.detectChanges();
    });

    it('should call securityService.reset on valid submission', fakeAsync(() => {
      securityServiceSpy.reset.and.returnValue(of({}));

      component.formGroup.get('password')?.setValue(validPassword);
      component.formGroup.get('confirmPassword')?.setValue(validPassword);
      component.onSubmit();
      tick();

      expect(securityServiceSpy.reset).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: 'reset-token-123',
        password: validPassword
      });
    }));

    it('should navigate to login on success', fakeAsync(() => {
      securityServiceSpy.reset.and.returnValue(of({}));

      component.formGroup.get('password')?.setValue(validPassword);
      component.formGroup.get('confirmPassword')?.setValue(validPassword);
      component.onSubmit();
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should show success toast on success', fakeAsync(() => {
      securityServiceSpy.reset.and.returnValue(of({}));

      component.formGroup.get('password')?.setValue(validPassword);
      component.formGroup.get('confirmPassword')?.setValue(validPassword);
      component.onSubmit();
      tick();

      expect(toastrSpy.success).toHaveBeenCalledWith('SIGN.RESET.SUCCESS');
    }));

    it('should display error message on failure', fakeAsync(() => {
      const err: CommonError = {
        statusText: 'Error',
        messages: ['Token expired'],
        friendlyMessage: 'Error',
        error: { message: 'Token Expired' }
      };
      securityServiceSpy.reset.and.returnValue(throwError(err));

      component.formGroup.get('password')?.setValue(validPassword);
      component.formGroup.get('confirmPassword')?.setValue(validPassword);
      component.onSubmit();
      tick();

      expect(component.errorMessage).toBe('Token Expired');
      expect(toastrSpy.error).toHaveBeenCalledWith('Token Expired');
    }));

    it('should not submit if form is invalid', () => {
      component.formGroup.get('password')?.setValue('');
      component.onSubmit();

      expect(securityServiceSpy.reset).not.toHaveBeenCalled();
    });
  });

  describe('toggle password visibility', () => {
    it('should toggle showPassword', () => {
      expect(component.showPassword).toBeFalse();
      component.onShowPasswordClick();
      expect(component.showPassword).toBeTrue();
      component.onShowPasswordClick();
      expect(component.showPassword).toBeFalse();
    });

    it('should toggle showConfirmPassword', () => {
      expect(component.showConfirmPassword).toBeFalse();
      component.onShowConfirmPasswordClick();
      expect(component.showConfirmPassword).toBeTrue();
      component.onShowConfirmPasswordClick();
      expect(component.showConfirmPassword).toBeFalse();
    });
  });

  describe('form reset', () => {
    it('should reset form and clear state', () => {
      component.formGroup.get('password')?.setValue(validPassword);
      component.errorMessage = 'Error';
      component.submitted = true;

      component.onReset();

      expect(component.formGroup.get('password')?.value).toBeNull();
      expect(component.errorMessage).toBeNull();
      expect(component.submitted).toBeFalse();
    });
  });
});
