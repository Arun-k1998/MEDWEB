import {createSlice} from '@reduxjs/toolkit'

const INITIAL_VALUES = {
    name:'',
    id:'',
    email:'',
    notifications:[{
        message:''
    }],
    wallet:null
}

const userSlice = createSlice({
    name:'user',
    initialState: INITIAL_VALUES,
    reducers:{
        userLogin(state,actions){
            const userDetails = actions.payload
            const notifications = userDetails.notifications.filter((notification)=> notification.view === true)
            state.name = userDetails.firstName
            state.id = userDetails._id
            state.email = userDetails.email
            state.notifications = notifications
            state.wallet = userDetails.wallet
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
