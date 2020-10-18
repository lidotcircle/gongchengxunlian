import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolComponent implements OnInit, AfterViewChecked {
  @Input() url: string;
  @Input() img: string;
  @Input() title: string;

  @ViewChild('tool', {static: true})
  tool: ElementRef;

  constructor() { }
  ngOnInit() {}

  ngAfterViewChecked(): void {
    /* do with css
    let elem = this.tool.nativeElement as HTMLElement;
    elem.style.height = getComputedStyle(elem).width;
    */
  }
}
