import { LoginInfoService } from './../../shared/service/login-info.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignupPage implements OnInit {

  constructor(private logininfo: LoginInfoService) { }

  ngOnInit() {
  }
}

