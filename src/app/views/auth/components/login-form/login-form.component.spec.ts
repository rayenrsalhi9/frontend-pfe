import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { UserAuth } from '@app/shared/enums/user-auth';
import { CommonError } from '@app/core/error-handler/common-error';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { LoginFormComponent } from './login-form.component';
import { TranslatePipeMock } from '@app/testing/mock.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const validPassword = 'Test@1234';
  const validEmail = 'test@example.com';

  beforeEach(async () => {
    securityServiceSpy = jasmine.createSpyObj('SecurityService', ['login', 'hasClaim']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent, TranslatePipeMock],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: SecurityService, useValue: securityServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should have email and password controls', () => {
      expect(component.formGroup.get('email')).toBeTruthy();
      expect(component.formGroup.get('password')).toBeTruthy();
    });

    it('should be invalid when empty', () => {
      expect(component.formGroup.valid).toBeFalse();
    });
  });

  describe('email validation', () => {
    it('should be invalid when email is empty', () => {
      const email = component.formGroup.get('email');
      email?.setValue('');
      expect(email?.valid).toBeFalse();
      expect(email?.errors?.['required']).toBeTruthy();
    });

    it('should be invalid with malformed email', () => {
      const email = component.formGroup.get('email');
      email?.setValue('notanemail');
      expect(email?.valid).toBeFalse();
      expect(email?.errors?.['email']).toBeTruthy();
    });

    it('should be invalid with missing domain', () => {
      const email = component.formGroup.get('email');
      email?.setValue('user@');
      expect(email?.valid).toBeFalse();
    });

    it('should be valid with correct email format', () => {
      const email = component.formGroup.get('email');
      email?.setValue(validEmail);
      expect(email?.valid).toBeTrue();
    });

    it('should be valid with subdomain email', () => {
      const email = component.formGroup.get('email');
      email?.setValue('user@sub.example.com');
      expect(email?.valid).toBeTrue();
    });
  });

  describe('password validation', () => {
    it('should be invalid when password is empty', () => {
      const password = component.formGroup.get('password');
      password?.setValue('');
      expect(password?.valid).toBeFalse();
      expect(password?.errors?.['required']).toBeTruthy();
    });

    it('should be invalid without uppercase letter', () => {
      const password = component.formGroup.get('password');
      password?.setValue('test@1234');
      expect(password?.valid).toBeFalse();
      expect(password?.errors?.['pattern']).toBeTruthy();
    });

    it('should be invalid without special character', () => {
      const password = component.formGroup.get('password');
      password?.setValue('TestA1234');
      expect(password?.valid).toBeFalse();
      expect(password?.errors?.['pattern']).toBeTruthy();
    });

    it('should be invalid without number', () => {
      const password = component.formGroup.get('password');
      password?.setValue('Test@abcd');
      expect(password?.valid).toBeFalse();
      expect(password?.errors?.['pattern']).toBeTruthy();
    });

    it('should be invalid with less than 8 characters', () => {
      const password = component.formGroup.get('password');
      password?.setValue('Te@1');
      expect(password?.valid).toBeFalse();
      expect(password?.errors?.['minlength']).toBeTruthy();
    });

    it('should be valid with all password requirements met', () => {
      const password = component.formGroup.get('password');
      password?.setValue(validPassword);
      expect(password?.valid).toBeTrue();
    });
  });

  describe('password requirements indicator', () => {
    it('hasUpperCase should detect uppercase letters', () => {
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

    it('hasMinLength should check length >= 8', () => {
      expect(component.hasMinLength('12345678')).toBeTrue();
      expect(component.hasMinLength('1234567')).toBeFalse();
    });
  });

  describe('submit button state', () => {
    it('should be disabled when form is invalid', () => {
      const button = fixture.nativeElement.querySelector('.lf-submit-btn');
      component.formGroup.get('email')?.setValue('');
      component.formGroup.get('password')?.setValue('');
      fixture.detectChanges();
      expect(button.disabled).toBeTrue();
    });

    it('should be disabled when isLoading is true even if form is valid', () => {
      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.isLoading = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.lf-submit-btn');
      expect(button.disabled).toBeTrue();
    });

    it('should be enabled when form is valid and not loading', () => {
      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.lf-submit-btn');
      expect(button.disabled).toBeFalse();
    });

    it('should show loading spinner when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('.icon-loader');
      expect(spinner).toBeTruthy();
    });
  });

  describe('login submission', () => {
    it('should sanitize email (trim and lowercase) before sending', () => {
      securityServiceSpy.login.and.returnValue(of(new UserAuth()));
      securityServiceSpy.hasClaim.and.returnValue(false);

      component.formGroup.get('email')?.setValue('Test@Example.COM');
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();

      expect(securityServiceSpy.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: validPassword
      });
    });

    it('should navigate to dashboard when user has dashboard_view_dashboard claim', fakeAsync(() => {
      securityServiceSpy.login.and.returnValue(of(new UserAuth()));
      securityServiceSpy.hasClaim.and.returnValue(true);

      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should navigate to root when user lacks dashboard_view_dashboard claim', fakeAsync(() => {
      securityServiceSpy.login.and.returnValue(of(new UserAuth()));
      securityServiceSpy.hasClaim.and.returnValue(false);

      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should display error message on failed login without toastr', fakeAsync(() => {
      const err: CommonError = {
        statusText: 'Unauthorized',
        messages: ['Invalid credentials'],
        friendlyMessage: 'Login failed',
        error: { message: 'Invalid email or password' }
      };
      securityServiceSpy.login.and.returnValue(throwError(err));

      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();
      tick();

      expect(component.errorMessage).toBe('Invalid email or password');
      expect(component.hasSubmissionError).toBeTrue();
      expect(component.hasSubmissionError).toBeTrue();
      expect(toastrSpy.error).not.toHaveBeenCalled();
    }));

    it('should show error alert when errorMessage is set', fakeAsync(() => {
      const err: CommonError = {
        statusText: 'Unauthorized',
        messages: ['Invalid credentials'],
        friendlyMessage: 'Login failed',
        error: { message: 'Invalid email or password' }
      };
      securityServiceSpy.login.and.returnValue(throwError(err));

      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();
      tick();
      fixture.detectChanges();

      const alert = fixture.nativeElement.querySelector('.lf-alert');
      expect(alert).toBeTruthy();
    }));

    it('should not submit if form is invalid', () => {
      component.formGroup.get('email')?.setValue('');
      component.formGroup.get('password')?.setValue('');
      component.login();

      expect(securityServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should set isLoading to false after successful login', fakeAsync(() => {
      securityServiceSpy.login.and.returnValue(of(new UserAuth()));
      securityServiceSpy.hasClaim.and.returnValue(false);

      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();
      tick();

      expect(component.isLoading).toBeFalse();
    }));

    it('should set isLoading to false after failed login', fakeAsync(() => {
      const err: CommonError = {
        statusText: 'Unauthorized',
        messages: ['Invalid'],
        friendlyMessage: 'Error',
      };
      securityServiceSpy.login.and.returnValue(throwError(err));

      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();
      tick();

      expect(component.isLoading).toBeFalse();
    }));

    it('should use generic error message when backend does not provide one', fakeAsync(() => {
      const err: CommonError = {
        statusText: 'Error',
        messages: ['Something went wrong'],
        friendlyMessage: 'Error',
      };
      securityServiceSpy.login.and.returnValue(throwError(err));

      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();
      tick();

      expect(component.errorMessage).toBe('SIGN.IN.ERROR_GENERIC');
      expect(component.hasSubmissionError).toBeTrue();
    }));

    it('should disable submit button when hasSubmissionError is true', () => {
      component.hasSubmissionError = true;
      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.lf-submit-btn');
      expect(button.disabled).toBeTrue();
    });

    it('should clear hasSubmissionError on field change', () => {
      component.hasSubmissionError = true;
      component.errorMessage = 'Some error';
      component.onFieldChange();
      expect(component.hasSubmissionError).toBeFalse();
      expect(component.errorMessage).toBeNull();
    });

    it('should set hasSubmissionError to false on successful login', fakeAsync(() => {
      securityServiceSpy.login.and.returnValue(of(new UserAuth()));
      securityServiceSpy.hasClaim.and.returnValue(false);

      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.login();
      tick();

      expect(component.hasSubmissionError).toBeFalse();
    }));

    it('should add lf-input--error class to email input when hasSubmissionError is true', () => {
      component.hasSubmissionError = true;
      fixture.detectChanges();
      const emailInput = fixture.nativeElement.querySelector('#login-email');
      expect(emailInput.classList.contains('lf-input--error')).toBeTrue();
    });

    it('should add lf-input--error class to password input when hasSubmissionError is true', () => {
      component.hasSubmissionError = true;
      fixture.detectChanges();
      const passwordInput = fixture.nativeElement.querySelector('#login-password');
      expect(passwordInput.classList.contains('lf-input--error')).toBeTrue();
    });
  });

  describe('toggle password visibility', () => {
    it('should toggle showPassword on click', () => {
      expect(component.showPassword).toBeFalse();
      component.onShowPasswordClick();
      expect(component.showPassword).toBeTrue();
      component.onShowPasswordClick();
      expect(component.showPassword).toBeFalse();
    });
  });

  describe('form reset', () => {
    it('should reset form and clear error message', () => {
      component.formGroup.get('email')?.setValue(validEmail);
      component.formGroup.get('password')?.setValue(validPassword);
      component.errorMessage = 'Some error';
      component.hasSubmissionError = true;
      component.submitted = true;

      component.onReset();

      expect(component.formGroup.get('email')?.value).toBeNull();
      expect(component.formGroup.get('password')?.value).toBeNull();
      expect(component.errorMessage).toBeNull();
      expect(component.hasSubmissionError).toBeFalse();
    });
  });
});
