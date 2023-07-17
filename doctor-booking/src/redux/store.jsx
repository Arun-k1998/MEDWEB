import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import doctorSlice from "./doctorSlice";

 const store = configureStore({
    reducer:{
        user: userSlice,
        doctor: doctorSlice
    }
})

export default store