import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ToastController } from '@ionic/angular';
import { StaticValue } from './../../../shared/static-value/static-value.module';
import * as MD5 from 'md5';
import { SessionStorageService } from 'src/app/shared/service/session-storage.service';
import { Router } from '@angular/router';
import * as utils from '../../../shared/utils/utils.module';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';

const MatchAll: string = utils.validation.MatchAll;
const NotMatch: string = utils.validation.NotMatch;

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

    constructor(private accountManager: ClientAccountManagerService, 
                private router: Router,
                private toast: ToastController,
                private sessionStorage: SessionStorageService) {
    }


    /** Slide 1 */
    validPhone = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
    duplicatePhone = false;
    validatePhone(): string {
        let valid = this.validPhone.test(this.signupData.phone) && !this.duplicatePhone;
        return valid ? MatchAll : NotMatch;
    }
    phoneChanged(newval) {
        this.duplicatePhone = false;
        this.accountManager.hasPhone(newval).then(has => {
            if (has && newval == this.signupData.phone)
                this.duplicatePhone = true;
        });
    }

    /** slide 2 */
    VerificationCodeMd5: string="";
    getVerificationCodeWait: number=0;
    async NewVerification(): Promise<void> {
        if (this.getVerificationCodeWait > 0) return;

        this.getVerificationCodeWait = StaticValue.VerificationCodeWait;
        this.getVerificationCodeWait++;
        let wait = () => {
            this.getVerificationCodeWait -= 1;
            if (this.getVerificationCodeWait == 0)
                return;
            setTimeout(() => wait(), 1000);
        };

        this.VerificationCodeMd5 = await this.accountManager.newUserRequest(this.signupData.phone);
        this.storeState();
        if (!this.VerificationCodeMd5) {
            this.toast.create({
                message: "获取验证码失败",
                duration: 2000,
            }).then(tt => tt.present());
        }

        wait();
    }
    testVerifyCode(): string {
        let xmd5 = MD5(this.signupData.code);
        return (this.VerificationCodeMd5 == xmd5) ? MatchAll : NotMatch;
    }

    /** Slide 3 */
    duplicateUsername = false;
    duplicateEmail = false;

   validateConfirmPassword(): string {
        return (this.signupData.password === this.signupData.confirmPassword) ? MatchAll : NotMatch;
    }
   emailChanged(newval) {
        this.duplicateEmail = false;
        this.accountManager.hasEmail(this.signupData.email).then(has => {
            if(has && newval == this.signupData.email)
                this.duplicateEmail = true;
        });
    }
    usernameChanged(newval) {
        this.duplicateUsername = false;
        this.accountManager.hasUsername(newval).then(has => {
            if(has && newval == this.signupData.shopName)
                this.duplicateUsername = true;
        });
    }

    /** Slide 4 */
    signupFail: boolean = false;
    signupSuccess: boolean = false;
    async confirmSignup() {
        this.signupFail = false;
        this.signupSuccess = false;

        const success = await this.accountManager.newUserConfirm(this.signupData);
        if (success) {
            this.signupSuccess = true;
            this.sessionStorage.remove(StaticValue.SIGNUP_INFO);
            this.sessionStorage.remove(StaticValue.SIGNUP_MD5);
            this.accountManager.login(this.signupData.phone, this.signupData.password).finally(() => {
                window.setTimeout(() => {
                    this.router.navigateByUrl(StaticValue.URLS.SIGNIN);
                    this.signupSuccess = false;
                    this.signupData = new StaticValue.SignupDataModel();
                    this.slides.slideTo(0);
                }, 2000);
            });
        } else {
            this.signupFail = true;
        }
        return success;
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

    ngOnInit() {
        this.recoverState();
        this.phoneChanged(this.signupData.phone);
        this.emailChanged(this.signupData.email);
        this.usernameChanged(this.signupData.shopName);
    }
}
