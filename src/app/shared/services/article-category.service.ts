import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonError } from "../enums/common-error";

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name: string;
  description?: string;
}

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
}

export type CategoryListResponse = CategoryDto[] | CommonError;

@Injectable({ providedIn: "root" })
export class ArticleCategoryService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
  ) {}

  allCategories(): Observable<CategoryListResponse> {
    const url = `articles/categories`;
    return this.httpClient
      .get<CategoryDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addCategory(
    data: CreateCategoryDto,
  ): Observable<CategoryDto[] | CommonError> {
    const url = `articles/categories/create`;
    return this.httpClient
      .post<CategoryDto[]>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateCategory(
    id: number,
    data: UpdateCategoryDto,
  ): Observable<CategoryDto[] | CommonError> {
    const url = `articles/categories/update/${id}`;
    return this.httpClient
      .put<CategoryDto[]>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteCategory(id: number): Observable<void | CommonError> {
    const url = `articles/categories/delete/${id}`;
    return this.httpClient
      .delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
