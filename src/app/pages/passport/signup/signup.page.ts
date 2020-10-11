import { ElementRef, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { LoginInfoService } from 'src/app/shared/service/login-info.service';
import { StaticValue } from './../../../shared/static-value/static-value.module';
import * as MD5 from 'md5';
import { makeCode } from 'src/app/shared/utils/utils.module';
import { SessionStorageService } from 'src/app/shared/service/session-storage.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';

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

  /** Slide 1 */
  validPhone = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
  @ViewChild('validCode', { static: false })
  validCodeItem: ElementRef;
  VerificationCodeMd5: string="";
  displayMessager: boolean=false;
  showPopMessage() {this.displayMessager = true;}
  hidePopMessage() {this.displayMessager = false;}

  getVerificationCodeWait: number=0;
  NewVerification(): void {
    if(this.getVerificationCodeWait>0) return;

    let code = makeCode(6);
    this.VerificationCodeMd5 = MD5(code);

    (this.validCodeItem.nativeElement as HTMLElement).innerHTML = code;
    this.showPopMessage();

    this.getVerificationCodeWait=StaticValue.VerificationCodeWait;
    this.getVerificationCodeWait++;
    let wait = () => {
      this.getVerificationCodeWait -= 1;
      if (this.getVerificationCodeWait == 0) 
        return;
      setTimeout(() => wait(), 1000);
    };
    wait();
  }
  testVerifyCode(): string {
    let xmd5 = MD5(this.signupData.code);
    return (this.VerificationCodeMd5 == xmd5) ? '^.*$' : '^1{1600}$';
  }
  slide1Acceptable(): boolean {
    let xmd5 = MD5(this.signupData.code);
    return this.validPhone.test(this.signupData.phone) && this.VerificationCodeMd5 == xmd5;
  }

  /** Slide 2 */
  validEmail = /^.*[@].*\..*$/;
  validName = /^[A-Za-z][A-Za-z0-9]{2,}$/;

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
           return this.validateConfirmPassword() && this.validateEmail() && 
           this.validateName();
  }

  onSlideWillChange(event) {
    this.slides.getActiveIndex().then(index => this.slideIndex = index);
  }

  nextSlide() {
    this.sessionStorage.set(StaticValue.SIGNUP_INFO, this.signupData);
    this.sessionStorage.set(StaticValue.SIGNUP_MD5,  this.VerificationCodeMd5);
    this.slides.slideNext();
  }
  prevSlide() {
    this.slides.slidePrev();
  }

  /** TODO remove session info when finish signup */
  constructor(private logininfo: LoginInfoService, private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {
  }
  ngOnInit() {
    console.log(this.localStorage);
    console.log(this.sessionStorage);
    let signinState = this.sessionStorage.get(StaticValue.SIGNUP_INFO, new StaticValue.SignupDataModel());
    let signinMd5 = this.sessionStorage.get(StaticValue.SIGNUP_MD5, "");
    this.signupData = signinState;
    this.VerificationCodeMd5 = signinMd5;
  }
}
