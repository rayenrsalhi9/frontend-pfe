import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'demo-radio-with-form',
    templateUrl: './withForm.html'
})
export class DemoRadioWithFormComponent implements OnInit {
    form = new FormGroup({
        gender: new FormControl('', Validators.required)
    });

    submit(){
    }

    constructor() { }

    ngOnInit(): void { }
}
