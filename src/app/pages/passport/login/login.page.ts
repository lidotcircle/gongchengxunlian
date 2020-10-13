import { StaticValue } from './../../../shared/static-value/static-value.module';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
  private mLoginInfo: StaticValue.SignupDataModel = new StaticValue.SignupDataModel();

  constructor() { }

  ngOnInit() {
  }

}
