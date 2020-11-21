import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-share-in-bottom',
  templateUrl: './share-in-bottom.component.html',
  styleUrls: ['./share-in-bottom.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShareInBottomComponent implements OnInit {
  @Output('qq')     qqEmitter = new EventEmitter();
  @Output('wechat') wechatEmitter = new EventEmitter();
  @Output('moment') momentEmitter = new EventEmitter();
  @Output('sms')    smsEmitter = new EventEmitter();
  @Output('cancel') cancelEmitter = new EventEmitter();

  @Input('message')
  private shareInfo: string;

  @ViewChild('shareRoot', {static: true})
  private shareRoot: ElementRef;

  showComponent: boolean = false;
  constructor(private toast: ToastController) { }
  ngOnInit() {
    const htmle = this.shareRoot.nativeElement as HTMLElement;
    const events = ['touchstart', 'click', 'dragstart'];
    events.map(e => htmle.addEventListener(e, (ev) => ev.stopPropagation()));
  }

  show() {
    this.showComponent = true;
  }

  private hide() {
    this.showComponent = false;
  }

  private notifyShare(msg: string) {
    this.toast.create({
      message: `分享页面, ${msg}`,
      duration: 2000
    }).then(t => t.present());
  }

  onClickWechat() {
    this.wechatEmitter.emit();
    this.notifyShare('微信');
    this.hide();
  }

  onClickMoment() {
    this.momentEmitter.emit();
    this.notifyShare('朋友圈');
    this.hide();
  }

  onClickSMS() {
    this.smsEmitter.emit();
    this.notifyShare('短信');
    this.hide();
  }

  onClickQQ() {
    this.qqEmitter.emit();
    this.notifyShare('QQ');
    this.hide();
  }

  onClickCancel() {
    this.hide();
  }
}
