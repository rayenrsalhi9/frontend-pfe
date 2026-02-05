import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-articles-views',
  templateUrl: './articles-views.component.html',
  styleUrls: ['./articles-views.component.scss']
})
export class ArticlesViewsComponent implements OnInit {

  data: any;

  constructor(
    public bsModalRef: BsModalRef,
    private cdr:ChangeDetectorRef
  ) { }

  getHost() {
    return environment.apiUrl
  }

  ngOnInit(): void {
    this.bsModalRef.setClass('modal-lg')
  }

}
