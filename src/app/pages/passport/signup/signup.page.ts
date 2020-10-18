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
import * as utils from '../../../shared/utils/utils.module';

const MatchAll: string = utils.validation.MatchAll;
const NotMatch: string = utils.validation.NotMatch;
const MessageTemplate =  '【生意专家】尊敬的用户，您的验证码: { code }.工作人员不会索取，请勿泄露。';

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
    duplicatePhone = false;
    validatePhone(): string {
        let valid = true;
        if (!this.validPhone.test(this.signupData.phone))
            valid = false;
        this.duplicatePhone = false;
        if (this.accountService.hasPhone(this.signupData.phone)) {
            valid = false;
            this.duplicatePhone = true;
        }
        return valid ? MatchAll : NotMatch;
    }

    /** slide 2 */
    VerificationCodeMd5: string="";
    getVerificationCodeWait: number=0;
    NewVerification(): void {
        if(this.getVerificationCodeWait>0) return;

        this.VerificationCodeMd5 = this.authenticationCode.NewVerificode(MessageTemplate, this.signupData.phone);
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
    duplicateEmail = false;

    validatePassword(): string {
        if (utils.validation.validPassword(this.signupData.password)) {
            return MatchAll;
        } else {
            return NotMatch;
        }
    }
    validateConfirmPassword(): string {
        return (this.signupData.password === this.signupData.confirmPassword) ? MatchAll : NotMatch;
    }
    validateEmail(): string {
        this.duplicateEmail = false;
        let r = this.accountService.hasEmail(this.signupData.email);
        if (r) {
            this.duplicateEmail = true;
        }
        r = !r && this.validEmail.test(this.signupData.email) 
        return  r ? MatchAll : NotMatch;
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
                this.slides.slideTo(0);
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
