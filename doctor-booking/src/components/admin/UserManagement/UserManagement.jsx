import React, { useState } from "react";
import ConfirmationModal from "../../../container/ConfirmationModal";

function UserManagement({ userList, handleClick }) {
  const [confirmation,setConfirmation] = useState(false)
  const [modal,setModal] = useState(false)
  const [actionType,setActionType] = useState(null)
  const [userId,setUserId] = useState('')
  const handlepopUp = async(action,userId) =>{
 
    setActionType(action)
    setUserId(userId)
    setModal(true)
   
  }

  const handleConfirmation = () =>{
    
    handleClick(actionType, userId) 
    setModal(false)
  }
  
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-[85%] h-full flex justify-center mt-10">
        <table className="w-full max-h-14 text-sm text-left text-gray-500 dark:text-gray-400 shadow-xl ">
          <thead className="text-xs text-gray-700 uppercase bg-[#05445E] dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                SI No
              </th>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, index) => {
              return (
                <>
                  <tr
                    className="bg-white border-b bg-[#a0d6db] dark:border-gray-700 "
                    key={index}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{`${user?.firstName} ${user?.lastName}`}</td>
                    <td className="px-6 py-4">{user?.email}</td>
                    <td className="px-6 py-4">{user?.phoneNumber}</td>
                    <td className="px-6 py-4 cursor-pointer underline underline-offset-2">
                      {user.is_Blocked ? (
                        <button
                          className="bg-lime-700 text-white p-2 rounded-lg w-24 "
                          // onClick={() => handleClick("unBlock", user._id)}
                          onClick={()=> handlepopUp("unBlock", user._id)}
                        >
                          UnBlock
                        </button>
                      ) : (
                        <button
                          className="bg-red-700 text-white p-2 rounded-lg w-24 "
                          // onClick={() => handleClick("block", user._id)}
                          onClick={()=> handlepopUp("block", user._id)}
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
        {modal && <ConfirmationModal action={actionType} setModal={setModal}  handleConfirmation={handleConfirmation} setConfirmation={setConfirmation} />}
      </div>
    </div>
  );
}

export default UserManagement;
