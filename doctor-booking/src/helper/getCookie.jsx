export default function getCookies() {
   const cookieArr = document.cookie.split(';')
//   console.log('-------cookieArr---------',cookieArr);
   let cookieObj = {}
   cookieArr.forEach((cookie)=>{
      // console.log('-----cookie----',cookie)
    const _ck = cookie.split('=')
   //  console.log("------",_ck)
    cookieObj[_ck[0]] = _ck[1]
   })
  
   return cookieObj
  }
  