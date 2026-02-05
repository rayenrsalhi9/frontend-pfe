import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '@app/core/security/security.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-susbcribe-modal',
  templateUrl: './susbcribe-modal.component.html',
  styleUrls: ['./susbcribe-modal.component.scss']
})
export class SusbcribeModalComponent implements OnInit {

  subscribeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public _bsModalRef: BsModalRef,
    private securitySevice:SecurityService

  ) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.subscribeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password:['123456',[]]
    });
  }

  subscribe() {
    if (this.subscribeForm.valid) {
      this.securitySevice.subscribeGuest(this.subscribeForm.value).subscribe(
        (data:any)=>{
          console.log(data);
          this._bsModalRef.hide()
        }
      )
    } else {
      this.subscribeForm.markAllAsTouched();
    }
  }

  cancel () {
    this._bsModalRef.hide()
  }

}
