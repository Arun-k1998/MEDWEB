import {createContext, useState} from 'react'

export const doctorContext = createContext(null)

export default function DoctorContext({children}){
    const [doctor,setDoctor] = useState('')
    const [approved,setApproved] = useState(null)
    const [id,setId] = useState('')
        return(
            <doctorContext.Provider value={{doctor,setDoctor,approved,setApproved,id,setId}} >
                {children}
            </doctorContext.Provider>
        )
}
