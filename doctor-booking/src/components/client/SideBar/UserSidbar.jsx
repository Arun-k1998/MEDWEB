import React from 'react'
import SearchBar from '../SearchBar/SearchBar'

function UserSidbar() {
  return (
    <div className='hidden md:block flex flex-col border-r-2 border-r-[#189AB4]'>
        <SearchBar />
      
    </div>
  )
}

export default UserSidbar
