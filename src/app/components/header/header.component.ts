import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @Input() leftIcon: string = '<ion-icon name="arrow-back-outline"></ion-icon>';
  @Input() leftText: string;
  @Input() url: string;
  @Input() title: string;
  @Input() tools: string[];
  @Output() leftClick = new EventEmitter<void>();
  @Output() toolClick = new EventEmitter<number>();
  ionLeftIcon: string = null;

  static IonIconHTMLReg=/^\s*<\s*ion-icon\s+name=\s*"([^"]+)"\s*>\s*<\s*\/ion-icon\s*>\s*$/;
  IONICONHTMLREG = HeaderComponent.IonIconHTMLReg;
  constructor(private location: Location) {
    const m = this.leftIcon.match(HeaderComponent.IonIconHTMLReg);
    if(m) {
      this.ionLeftIcon = m[1];
    }
  }

  goBack() {
    this.location.back();
  }

  onLeftClick() {
    this.leftClick.emit();
  }

  onToolClick(n: number) {
    this.toolClick.emit(n);
  }

  ngOnInit() {
  }
}
