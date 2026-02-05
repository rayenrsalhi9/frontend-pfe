import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { Role } from '../enums/role';
import { UserRoles } from '../enums/user-roles';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

    getPages(): Observable<any | CommonError> {
      const url = `pages`;
      return this.httpClient.get(url).pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getActions(): Observable<any | CommonError> {
      const url = `actions`;
      return this.httpClient.get(url).pipe(catchError(this.commonHttpErrorService.handleError));
    }

  updateRole(role: Role): Observable<Role | CommonError> {
    const url = `role/${role.id}`;
    return this.httpClient.put<Role>(url, role)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addRole(role: Role): Observable<Role | CommonError> {
    const url = `role`;
    return this.httpClient.post<Role>(url, role)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteRole(id: string): Observable<void | CommonError> {
    const url = `role/${id}`;
    return this.httpClient.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getRole(id: string): Observable<Role | CommonError> {
    const url = `role/${id}`;
    return this.httpClient.get<Role>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getRoleUsers(id: string): Observable<UserRoles[] | CommonError> {
    const url = `roleusers/${id}`;
    return this.httpClient.get<UserRoles[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateRoleUsers(roleId: string, userRoles: UserRoles[]): Observable<UserRoles[] | CommonError> {
    const url = `roleusers/${roleId}`;
    return this.httpClient.put<UserRoles[]>(url, { userRoles })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
