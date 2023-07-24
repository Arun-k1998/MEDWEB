import React, { useEffect } from 'react'

function SearchBar({search,value}) {
   
  return (
    <div className=' flex justify-center mt-6 h-16 py-2 w-full'>
        <input type="search" className='w-2/4 rounded-xl p-4 border border-spacing-8' placeholder='Search For Doctors ' value={value} onChange={(e)=>search(e)} />
       
    </div>
  )
}

export default SearchBar
