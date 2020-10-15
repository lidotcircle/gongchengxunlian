
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

  export const MatchAll: string = '^.*$';
  export const NotMatch: string = '.^';
}
