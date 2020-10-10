import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { LoginInfoService } from 'src/app/shared/service/login-info.service';
import { StaticValue } from './../../../shared/static-value/static-value.module';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignupPage implements OnInit {

  @ViewChild(IonSlides, { static: false })
  slides: IonSlides;

  signupData: StaticValue.SignupDataModel = new StaticValue.SignupDataModel();
  slideIndex: number = 0;

  validPhone = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
  validEmail = /^.*[@].*\..*$/;
  validName = /^[A-Za-z][A-Za-z0-9]{2,}$/;

  validatePhone(): boolean {
    return this.validPhone.test(this.signupData.phone);
  }
  validatePassword(): boolean {
    if (this.signupData.password.length < 6) return false;
    if (!/[0-9]/.test(this.signupData.password)) return false;
    if (!/[a-z]/.test(this.signupData.password)) return false;
    if (!/[A-Z]/.test(this.signupData.password)) return false;
  }
  validateConfirmPassword(): boolean {
    return this.signupData.password === this.signupData.confirmPassword;
  }
  validateEmail(): boolean {
    return this.validEmail.test(this.signupData.email);
  }
  validateName(): boolean {
    return this.validName.test(this.signupData.shopName);
  }
  validateAll(): boolean {
    return this.validatePhone() && this.validatePassword() && 
           this.validateConfirmPassword() && this.validateEmail() && 
           this.validateName();
  }

  onSlideWillChange(event) {
    this.slides.getActiveIndex().then(index => this.slideIndex = index);
  }

  nextSlide() {
    this.slides.slideNext();
  }
  prevSlide() {
    this.slides.slidePrev();
  }

  constructor(private logininfo: LoginInfoService) { }
  ngOnInit() { }
}
