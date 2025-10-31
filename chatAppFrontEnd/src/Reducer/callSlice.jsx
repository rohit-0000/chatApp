import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../Utils/websocket";
import toast from "react-hot-toast";
import { useRef } from "react";
const initialState = {
    activeRoomId: null,
    status: "idle", // idle | calling | in-call  | incoming
    error: null,
};

export const startCall = createAsyncThunk("call/startCall", async (roomId, { rejectWithValue }) => {
  try {
    if (!client?.connected) throw new Error("WebSocket not connected");
    client.send("/app/startCall", {}, JSON.stringify({ roomId }));
    console.log(`Call started in room: ${roomId}`);
    return roomId;
  } catch (error) {
    console.error("Error starting call:", error.message);
    return rejectWithValue(error.message);
  }
});

export const endCall = createAsyncThunk("call/endCall", async (roomId, { rejectWithValue }) => {
  try {
    if (!client?.connected) throw new Error("WebSocket not connected");
    client.send("/app/endCall", {}, JSON.stringify({ roomId }));
    console.log(`Call ended in room: ${roomId}`);
    return roomId;
  } catch (error) {
    console.error("Error ending call:", error.message);
    return rejectWithValue(error.message);
  }
});

export const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    resetCallState: (state) => {
      state.activeRoomId = null;
      state.status = "idle";
      state.error = null;
    },
    setCallStatus: (state, action) => {
        if(action.payload.status == "incoming"){
            state.activeRoomId = action.payload.roomId;
            state.status = "incoming";
        }
        else{
            state.activeRoomId=null;
            state.status = "idle";
        }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startCall.pending, (state) => {
        state.status = "calling";
        toast.success("calling ....");
      })
      .addCase(startCall.fulfilled, (state, action) => {
        state.activeRoomId = action.payload;

        state.status = "in-call";
        toast.success("call accepted ...."+state.activeRoomId);
      })
      .addCase(startCall.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
        toast.success("call rejected ....");
      })
      .addCase(endCall.fulfilled, (state) => {
        state.status = "idle";
        state.activeRoomId = null;
      });
  },
});

// export {callSlice};
export default callSlice.reducer;
export const { resetCallState,setCallStatus } = callSlice.actions;
