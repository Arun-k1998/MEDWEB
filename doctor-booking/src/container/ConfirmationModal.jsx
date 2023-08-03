import React from 'react'

function ConfirmationModal({setConfirmation,handleConfirmation,setModal ,action}) {
  return (
    <>
     <div className="fixed inset-0 bg-transparent  backdrop-blur-sm  flex justify-center items-center flex-col ">
        <div className="bg-white rounded-lg p-10 flex flex-col justify-center items-center  ">
          <div >
          <h1>Delete</h1>
          </div>
          <div className="mt-3">
            <p>{`Are you Sure You want to ${action? action:'delete'}`}</p>
          </div>
          <div className="mt-3">
            <button className="bg-red-600 text-white rounded-lg px-4 py-2" onClick={()=> handleConfirmation()}>Confirm</button>
            <button className="bg-green-700 text-white rounded-lg px-4 py-2 ml-4" onClick={()=> setModal(false)} >Cancel</button>
          </div>
          
        </div>
      </div> 
    </>
  )
}

export default ConfirmationModal
