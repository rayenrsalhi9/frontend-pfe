import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Role } from '@app/shared/enums/role';
import { User } from '@app/shared/enums/user-auth';
import { CommonService } from '@app/shared/services/common.service';
import { UserService } from '@app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
import { Employe } from '@app/shared/enums/employe';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  user: User;
  userForm: FormGroup;
  roleList: Role[];
  isEditMode = false;
  selectedRoles: Role[] = [];
  employeList: Employe[] = []; // Ajoutez cette ligne pour stocker la liste des employés
  selectedEmploye: Employe  
 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createUserForm();
    this.activeRoute.data.subscribe((data: { user: User }) => {
      if (data.user) {
        this.isEditMode = true;
        this.userForm.patchValue(data.user);
        this.user = data.user;
        this.userForm.get('email').disable();
      } else {
        this.userForm
          .get('password')
          .setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm
          .get('confirmPassword')
          .setValidators([Validators.required]);
      }
    });
    this.getRoles();
    this.loadEmployes();
  }

  selectRole(event:any){
    this.selectedRoles = event
  }

  createUserForm() {
    this.userForm = this.fb.group(
      {
        id: [''],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]],
        direction: ['', ],
        matricule: ['',],
        password: [''],
        confirmPassword: [''],
      },
      {
        validator: this.checkPasswords,
      }
    );
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  saveUser() {
    if (this.userForm.valid) {
      const user = this.createBuildObject();
      if (this.isEditMode) {
        this.userService.updateUser(user).subscribe(() => {
          this.toastrService.success(
          );
          this.router.navigate(['/users']);
        });
      } else {
        this.userService.addUser(user).subscribe(() => {
          this.translate.get('USERS.ADD.TOAST.ADDED_SUCCESS').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          }); 
          this.router.navigate(['/user/list']);
        });
      }
    } else {
      this.translate.get('USERS.ADD.TOAST.ADDED_ERROR').subscribe((translatedMessage: string) => {
        this.toastrService.success(translatedMessage); 
      }); 
    }
  }

  createBuildObject(): User {
    const user: User = {
      id: this.userForm.get('id').value,
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      email: this.userForm.get('email').value,
      phoneNumber: this.userForm.get('phoneNumber').value,
      password: this.userForm.get('password').value,
      userName: this.userForm.get('email').value,
      matricule: this.userForm.get('matricule').value,
      direction: this.userForm.get('direction').value,
      roleIds: this.getSelectedRoles(),
    };
    return user;
  }

  getSelectedRoles() {
    return this.selectedRoles.map((role) => {
      return role.id;
    });
  }

  getRoles() {
    this.commonService
      .getRolesForDropdown()
      .subscribe((roles: Role[]) => {
        this.roleList = roles;
        /* if (this.isEditMode) {
          const selectedRoleIds = this.user.userRoles.map((c) => c.roleId);
          this.selectedRoles = this.roleList.filter(
            (c) => selectedRoleIds.indexOf(c.id) > -1
          );
        } */
      });
  }
  loadEmployes(): void {
    this.userService.getEmployes().subscribe(
      (data: Employe[]) => {
        this.employeList = data; // Stockez les employés récupérés
        
      },
      (error) => {
        console.error('Erreur lors de la récupération des employés:', error);
      }
    );
  }

  selectEmploye(event: any): void {
    this.selectedEmploye = event;
     if (this.selectedEmploye != null) {
      const selectedEmployee = this.selectedEmploye;
      
      // Update the form with the selected employee's data
      this.userForm.patchValue({
        id: selectedEmployee.id,
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        email: selectedEmployee.email,
        direction: selectedEmployee.direction,
        matricule: selectedEmployee.matricule
      });
    } else {
      this.userForm.reset(); // Reset the form if no employee is selected
    }   
  }

  
}
