import { Injectable } from '@angular/core';
import { makeCode, makeElement } from '../utils/utils.module';
import * as MD5 from 'md5';
import { StaticValue } from '../static-value/static-value.module';

const template: string = `
  <div id='${StaticValue.MSG.MSG_ID}' class='pop-message-container'>
    <style>
    .pop-message {
      position: fixed;
      z-index: 100;
      width: 80%;
      left: 10%;
      bottom: 50%;
      min-height: 22%;
      background-color: rgba(200, 200, 200, 0.95);
      padding: 0.2em 0.8em 1em 0.8em;
      border-radius: 0.4em;
      box-sizing: border-box;
    }
    .pop-message .pop-closer {
      box-sizing: border-box;
      padding: 0.2em 0.2em 0.4em 0.2em;
      text-align: right;
      width: 100%;
    }
    .pop-message .pop-closer button {
        background: rgba(0,0,0,0);
    }
    .pop-message-phone {
      padding: 0.5em 0em 0.8em 0em;
    }
    </style>
    <div class="pop-message">
        <div class="pop-closer">
            <button class="pop-message-button">X</button>
        </div>
        <div class="pop-message-phone">
            <span class="pop-message-phone-field"></span>:
        </div>
        <div class="pop-message-body">
        </div>
   </div>
  </div>
`;

 

@Injectable({
  providedIn: 'root'
})
export class AuthenticationCodeService {
  constructor() { }

  private sendMsg(phone: string, __msg: string) {
    let msg = document.querySelector('#' + StaticValue.MSG.MSG_ID) as HTMLElement;
    if (msg != null)
      msg.remove();
    let node = makeElement(template);

    let codeElem = node.querySelector(".pop-message-body");
    codeElem.innerHTML = __msg;

    let phoneElem = node.querySelector(".pop-message-phone-field");
    phoneElem.innerHTML = phone;

    let buttonElem = node.querySelector(".pop-message-button");
    buttonElem.addEventListener("click", (event: CustomEvent) => {
      node.remove();
    });

    document.body.appendChild(node);
  }

  /**
   * 发送验证码
   *
   * @param {string} format 验证码的格式，需包含 '{code}' 用于替换验证码
   * @param {string} phone  接收验证码的手机号
   * @return {*}  {string}  验证码的 MD5 值
   * @memberof AuthenticationCodeService
   */
  NewVerificode(format: string, phone: string): string {
    const validString = /^(.*)(\{\s*code\s*\})(.*)$/;
    let match = format.match(validString);
    if (!match) {
      throw new Error("bad message template");
    }

    let code = makeCode(6);
    let md5 = MD5(code);
    let msg = match[1] + `<span class="pop-message-code">${code}</span>` + match[3];
    this.sendMsg(phone, msg);
    return md5;
  }
}
