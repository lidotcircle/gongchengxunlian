import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ldy-copyright',
    templateUrl: './copyright.component.html',
    styleUrls: ['./copyright.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CopyrightComponent implements OnInit {

    company: string = "生意专家";
    year:    number = 0;
    constructor() {
        this.year = (new Date()).getFullYear();
    }

    ngOnInit() {}
}
