import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import doctorSlice from "./doctorSlice";
import adminSlice from "./adminSlice";

 const store = configureStore({
    reducer:{
        user: userSlice,
        doctor: doctorSlice,
        admin: adminSlice
    }
})

export default store