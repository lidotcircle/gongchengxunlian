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
  @Input() leftIcon: string = "🡠";
  @Input() leftText: string;
  @Input() url: string;
  @Input() title: string;
  @Input() tools: string[];
  @Output() leftClick = new EventEmitter<void>();
  @Output() toolClick = new EventEmitter<number>();

  constructor(private location: Location,
              private router: Router) {
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
