export default function getCookies() {
   const cookieArr = document.cookie.split(';')
  
   let cookieObj = {}
   cookieArr.forEach((cookie)=>{
    const _ck = cookie.split('=')
    cookieObj[_ck[0]] = _ck[1]
   })
  
   return cookieObj
  }
  