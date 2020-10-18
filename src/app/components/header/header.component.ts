import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @Input() leftIcon: string = "🡨";
  @Input() leftText: string;
  @Input() url: string;
  @Input() title: string;

  constructor(private location: Location,
              private router: Router) {
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }
}
