
export function makeid(length: number): string //{
{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghipqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ )
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
} //}

export function makeCode(length: number): string //{
{
  let result = '';
  let characters = '0123456789'
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
} //}

export function makeElement(htmlText: string): Element {
  let div = document.createElement('div');
  div.innerHTML = htmlText;
  return div.children[0];
}

export module validation {
  export function validPassword(password: string): boolean {
    if (password.length < 6) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    return true;
  }

  const __validName  = /^([A-Za-z]|\p{Unified_Ideograph})([A-Za-z0-9_]|\p{Unified_Ideograph}){2,}$/u;
  export function validName(name: string): boolean {
    return __validName.test(name);
  }
  const __validPhone = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
  export function validPhone(phone: string): boolean {
    return __validPhone.test(phone);
  }
  const __validEmail = /^.*[@].*\..*$/;
  export function validEmail(email: string): boolean {
    return __validEmail.test(email);
  }

  export const MatchAll: string = '^.*$';
  export const NotMatch: string = '.^';

  export const validationMap: Map<string, (val: string) => boolean> = new Map<string, (val: string) => boolean>([
    ["password", validPassword],
    ["shopName", validName],
    ["shopOwnerName", validName],
    ["nickname", validName],
    ["shopType", validName],
    ["phone", validPhone],
    ["shopPhone", validPhone],
    ["email", validEmail],
  ]);
}

export function assignTargetEnumProp(src: Object, target: Object) {
    for(const prop in target)
        target[prop] = src[prop];
}

export function CopySourceEnumProp(src: Object, target: Object) {
    for(const prop in src)
        target[prop] = src[prop];
}

export function randomInt(max: number = Math.max()): number {
  return Math.floor(Math.random() * Math.floor(Math.floor(max)));
}
