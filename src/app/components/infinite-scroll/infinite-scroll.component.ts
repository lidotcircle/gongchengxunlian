import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { isElemHidden } from 'src/app/shared/utils/utils.module';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
  @Input('spinnerName') private spinner: string;
  @Input('message') private _msg: string;
  @Output('infinite') private ex = new EventEmitter();
  private _show: boolean = false;
  private prevPtr: [number, number] = [-1, -1];
  private startPtr: [number, number] = [-1, -1];
  private inMove: boolean = false;
  get show() {return this._show;}
  get msg() { return this._msg; }

  constructor(private elemRef: ElementRef) {
    this.spinner = this.spinner || 'bubbles';
    this._msg = this._msg || '';
  }

  private showMessage() {
    this._show = true;
    this.ex.emit({target: this});
  }

  async complete() {
    this._show = false;
    await new Promise((resolve) => setTimeout(() => resolve(), 0));
  }

  private isHidden(): boolean {
    let e: HTMLElement = this.elemRef.nativeElement;
    return isElemHidden(e);
  }
  onTouchStart(ev: TouchEvent) {
    if(this.isHidden()) return;
    if(this._show) return;
    this.inMove = true;
    this.prevPtr = [ev.touches[0].pageX, ev.touches[0].pageY];
    this.startPtr = this.prevPtr;
  }
  onTouchMove(ev: TouchEvent) {
    if(!this.inMove) return;
    const cPtr: [number, number] = [ev.touches[0].pageX, ev.touches[0].pageY];
    if(cPtr[1] >= this.prevPtr[1]) {
      this.inMove = false;
    } else {
      this.prevPtr=  cPtr;
    }
  }
  onTouchEnd(ev: TouchEvent) {
    if(!this.inMove) return;
    this.inMove = false;
    if (this.startPtr[1] - this.prevPtr[1] > 100) {
      this.showMessage();
    }
  }
  onTouchCancel(ev: TouchEvent) {
    this.inMove = false;
  }
  private touchStart;
  private touchMove;
  private touchEnd;
  private touchCancel;
  ngOnInit() {
    this.touchStart = document.body.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.touchMove = document.body.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.touchEnd = document.body.addEventListener('touchend', this.onTouchEnd.bind(this));
    this.touchCancel = document.body.addEventListener('touchcancel', this.onTouchCancel.bind(this));
  }

  ngOnDestroy() {
    document.body.removeEventListener('touchstart', this.touchStart);
    document.body.removeEventListener('touchmove', this.touchMove);
    document.body.removeEventListener('touchend', this.touchEnd);
    document.body.removeEventListener('touchcancel', this.touchCancel);
  }
}
