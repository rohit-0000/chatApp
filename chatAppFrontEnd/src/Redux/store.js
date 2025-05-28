import {configureStore} from '@reduxjs/toolkit'
import { chatSlice } from '../Reducer/chatSlice'
export const store=configureStore({
    reducer:{
        chatApp:chatSlice.reducer,
    }
})