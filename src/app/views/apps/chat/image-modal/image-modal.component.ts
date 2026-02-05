import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  getHost() {
    return environment.apiUrl
  }

  data:any

  ngOnInit(): void {
    this.bsModalRef.setClass('modal-lg')
  }

}
