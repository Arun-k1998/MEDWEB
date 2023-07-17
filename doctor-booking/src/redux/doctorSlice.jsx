import { createSlice } from "@reduxjs/toolkit";


const INITIAL_VALUES = {
        name:"",
        approved:"",
        id:""
}

const doctorSlice = createSlice({
    name:'doctor',
    initialState:INITIAL_VALUES,
    reducers:{
        doctorLogin(state,actions){
            const doctorDetials = actions.payload
            state.name = doctorDetials.firstName
            state.approved = doctorDetials.approved
            state.id = doctorDetials._id
        },
        doctorLogout(state,actions){
            state.name = ""
            state.approved = ""
            state.id = ""
        }

    }
})

export const {doctorLogin,doctorLogout} = doctorSlice.actions
export default doctorSlice.reducer