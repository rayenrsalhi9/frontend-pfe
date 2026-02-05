import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ForumService } from '@app/views/apps/forum/forum.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  rows:any[] = []

  categories = []
  tags = []
  sort = []
  status = []

  constructor(
    private forumService:ForumService,
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllForums()
  }

  getAllForums() {
    this.forumService.allForums().subscribe(
      (data:any)=>{
        this.rows = data
        this.cdr.markForCheck()
      },
      (error:any)=>{
        console.log(error);
      }
    )
    this.cdr.detectChanges()
  }

  onCategoryChange(data:any) {}

}
