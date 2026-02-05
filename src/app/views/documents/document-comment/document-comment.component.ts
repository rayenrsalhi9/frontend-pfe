import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentComment } from '@app/shared/enums/document-comment';
import { DocumentCommentService } from '@app/shared/services/document-comment.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-document-comment',
  templateUrl: './document-comment.component.html',
  styleUrls: ['./document-comment.component.css']
})
export class DocumentCommentComponent implements OnInit {

  width: any;
  height: any;
  maxHeight: any;
  panelClass: any;
  data: any;
  commentForm: FormGroup;
  documentComments: DocumentComment[] = [];

  constructor(
    private fb: FormBuilder,
    private documentCommentService: DocumentCommentService,
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    this.getDocumentComment()
    this.createForm()
  }

  closeDialog() {
    this.bsModalRef.hide();
  }

  createForm() {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]],
    });
  }
  getDocumentComment() {
    this.documentCommentService
      .getDocumentComment(this.data.id)
      .subscribe((c: DocumentComment[]) => {
        this.documentComments = c;
      });
  }
  patchComment(comment: string) {
    this.commentForm.patchValue({
      comment: comment,
    });
  }
  addComment() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }
    const documentComment: DocumentComment = {
      documentId: this.data.id,
      comment: this.commentForm.get('comment').value,
    };
    this.documentCommentService
      .saveDocumentComment(documentComment)
      .subscribe(() => {
        this.patchComment('');
        this.commentForm.markAsUntouched();
        this.getDocumentComment();
      });
  }
  onDelete(id: string) {
    this.documentCommentService
            .deleteDocumentComment(id)
            .subscribe(() => {
              this.getDocumentComment();
            });
  }

}
