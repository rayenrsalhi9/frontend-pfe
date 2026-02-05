import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {


  title:string;
  message:string;
  button:any;
  public onClose: Subject<boolean> = new Subject<boolean>();

  constructor(
    public _bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  confirm() {
    this.onClose.next(true);
    this._bsModalRef.hide();
  }

  close() {
    this.onClose.next(false);
    this._bsModalRef.hide()
  }

}
