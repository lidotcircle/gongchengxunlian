
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
