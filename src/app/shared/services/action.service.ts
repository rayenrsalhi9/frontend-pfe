/* import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { map } from 'rxjs/operators';
import { Action } from '../enums/action';

@Injectable({ providedIn: 'root' })
export class ActionService extends EntityCollectionServiceBase<Action> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Action', serviceElementsFactory);
  }

  getActionByPage(id: string) {
    return this.getAll().pipe(
      map((response) => {
        return response.filter((c) => c.pageId == id);
      })
    );
  }
} */
