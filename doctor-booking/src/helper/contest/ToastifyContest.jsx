import { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastifyContest = createContext(null)

 function toastityFucn({children}){

    const show = (message)=>{
        toast.success(` ${message} `, {
            position: "top-center",
            autoClose: 3001,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            
            });
    }

    return (
        <ToastifyContest.Provider value={{show:show}} >
            {
                children
            }
            <ToastContainer
        position="top-left"
        autoClose={3001}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
        </ToastifyContest.Provider>
    )

}
export default toastityFucn