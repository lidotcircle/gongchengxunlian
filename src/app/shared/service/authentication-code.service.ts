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
        【生意专家】尊敬的用户，您的验证码: <span class="pop-message-code"></span>，
        工作人员不会索取，请勿泄露。
    </div>
  </div>
`;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationCodeService {
  constructor() { }

  private sendMsg(phone: string, code: string) {
    let msg = document.querySelector('#' + StaticValue.MSG.MSG_ID) as HTMLElement;
    if (msg != null)
      msg.remove();
    let node = makeElement(template);

    let codeElem = node.querySelector(".pop-message-code");
    codeElem.innerHTML = code;

    let phoneElem = node.querySelector(".pop-message-phone-field");
    phoneElem.innerHTML = phone;

    let buttonElem = node.querySelector(".pop-message-button");
    buttonElem.addEventListener("click", (event: CustomEvent) => {
      console.log(`Recieve message code: ${code}`);
      node.remove();
    });

    document.body.appendChild(node);
  }

  NewVerificode(phone: string): string {
    let code = makeCode(6);
    let md5 = MD5(code);
    this.sendMsg(phone, code);
    return md5;
  }
}
