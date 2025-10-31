import {configureStore} from '@reduxjs/toolkit'
import { callSlice } from '../Reducer/callSlice'
import { chatSlice } from '../Reducer/chatSlice'
export const store=configureStore({
    reducer:{
        call:callSlice.reducer,
        chatApp:chatSlice.reducer,
    }
})

