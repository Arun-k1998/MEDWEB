import {createSlice} from '@reduxjs/toolkit'

const INITIAL_VALUES = {
    name:'',
    id:'',
    email:''
}

const userSlice = createSlice({
    name:'user',
    initialState: INITIAL_VALUES,
    reducers:{
        userLogin(state,actions){
            const userDetails = actions.payload
            state.name = userDetails.firstName
            state.id = userDetails._id
            state.email = userDetails.email
        },
        userLogout(state,actions){
            state.name = ''
            state.id = ''
            state.email = ''
        }

    }
})

export const {userLogin,userLogout} = userSlice.actions
export default userSlice.reducer
