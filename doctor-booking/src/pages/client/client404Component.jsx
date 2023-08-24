import React from 'react'
import Client404Component from '../../components/client/404Error/Client404'

function client404({role}) {
  return (
    <div className='w-full h-full'>
      <Client404Component role={role}  />
    </div>
  )
}
 
export default client404
