import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

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
  constructor() { }
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

  onClickWechat() {
    this.wechatEmitter.emit();
    this.hide();
  }

  onClickMoment() {
    this.momentEmitter.emit();
    this.hide();
  }

  onClickSMS() {
    this.smsEmitter.emit();
    this.hide();
  }

  onClickQQ() {
    this.qqEmitter.emit();
    this.hide();
  }

  onClickCancel() {
    this.hide();
  }
}
