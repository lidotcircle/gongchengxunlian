import { ElementRef, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { AccountManageService } from 'src/app/shared/service/account-manage.service';
import { StaticValue } from './../../../shared/static-value/static-value.module';
import * as MD5 from 'md5';
import { SessionStorageService } from 'src/app/shared/service/session-storage.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { AuthenticationCodeService } from 'src/app/shared/service/authentication-code.service';
import { Router } from '@angular/router';

const MatchAll: string = "^.*$";
const NotMatch: string = "x{2000000}";

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

  /** slide 2 */
  VerificationCodeMd5: string="";
  getVerificationCodeWait: number=0;
  NewVerification(): void {
    if(this.getVerificationCodeWait>0) return;

    this.VerificationCodeMd5 = this.authenticationCode.NewVerificode(this.signupData.phone);
    this.storeState();

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
    return (this.VerificationCodeMd5 == xmd5) ? MatchAll : NotMatch;
  }
  slide2Acceptable(): boolean {
    let xmd5 = MD5(this.signupData.code);
    return this.validPhone.test(this.signupData.phone) && this.VerificationCodeMd5 == xmd5;
  }

  /** Slide 3 */
  // 支持汉字的正则表达式
  // /\p{Script=Han}/u        经测试能匹配标点
  // /\p{Unified_Ideograph}/u 不匹配标点

  validEmail = /^.*[@].*\..*$/;
  validName  = /^([A-Za-z]|\p{Unified_Ideograph})([A-Za-z0-9_]|\p{Unified_Ideograph}){2,}$/u;
  duplicateUsername = false;

  validatePassword(): string {
    if (this.signupData.password.length < 6) return NotMatch;
    if (!/[0-9]/.test(this.signupData.password)) return NotMatch;
    if (!/[a-z]/.test(this.signupData.password)) return NotMatch;
    if (!/[A-Z]/.test(this.signupData.password)) return NotMatch;
    return MatchAll;
  }
  validateConfirmPassword(): string {
    return (this.signupData.password === this.signupData.confirmPassword) ? MatchAll : NotMatch;
  }
  validateEmail(): string {
    return this.validEmail.test(this.signupData.email) ? MatchAll : NotMatch;
  }
  validateName(): string {
    let valid = true;
    if (!this.validName.test(this.signupData.shopName))
      valid = false;
    this.duplicateUsername = false;
    if (this.accountService.hasName(this.signupData.shopName)) {
      valid = false;
      this.duplicateUsername = true;
    }
    return valid ? MatchAll : NotMatch;
  }
  slide3Acceptable(): boolean {
    return (this.validateName() === MatchAll &&  this.validateEmail() === MatchAll &&
            this.validatePassword() === MatchAll && this.validateConfirmPassword() === MatchAll);
  }

  /** Slide 4 */
  signupFail: boolean = false;
  signupSuccess: boolean = false;
  confirmSignup() {
    this.signupFail = false;
    this.signupSuccess = false;
    if (!this.slide2Acceptable() || !this.slide3Acceptable()) {
      this.signupFail = true;
      return;
    }
    let r = this.accountService.addUser(this.signupData);
    if (r) {
      this.signupSuccess = true;
      this.sessionStorage.remove(StaticValue.SIGNUP_INFO);
      this.sessionStorage.remove(StaticValue.SIGNUP_MD5);
      window.setTimeout(() => {
        this.router.navigateByUrl(StaticValue.URLS.SIGNIN);
        this.signupSuccess = false;
        this.signupData = new StaticValue.SignupDataModel();
      }, 2000);
    } else {
      this.signupFail = true;
    }
    return r;
  }

  onSlideWillChange(event) {
    this.slides.getActiveIndex().then(index => this.slideIndex = index);
  }

  storeState() {
    this.sessionStorage.set(StaticValue.SIGNUP_INFO, this.signupData);
    this.sessionStorage.set(StaticValue.SIGNUP_MD5,  this.VerificationCodeMd5);
  }

  recoverState() {
    let signinState = this.sessionStorage.get(StaticValue.SIGNUP_INFO, new StaticValue.SignupDataModel());
    let signinMd5 = this.sessionStorage.get(StaticValue.SIGNUP_MD5, "");
    this.signupData = signinState;
    this.VerificationCodeMd5 = signinMd5;
  }

  nextSlide() {
    this.storeState();
    this.slides.slideNext();
  }
  prevSlide() {
    this.slides.slidePrev();
  }

  constructor(private accountService: AccountManageService, 
              private router: Router,
              private authenticationCode: AuthenticationCodeService,
              private sessionStorage: SessionStorageService) {
  }

  ngOnInit() {
    this.recoverState();
  }
}
