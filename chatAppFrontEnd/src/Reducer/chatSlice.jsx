import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
// import { Navigate } from "react-router";

const initialState = {
  user: localStorage.getItem("chatAppUserDetail"),
  token: localStorage.getItem("chatAppToken"),
  friends: [],
  isLoading:false,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/public/login`,
        user
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);

export const sendEmail = createAsyncThunk(
  "email/send",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/email/send`,
        email
      );
      return response.status;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);
export const createUser = createAsyncThunk(
  "create/user",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/public/Signup`,
        user
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);

export const changePassword = createAsyncThunk(
  "change/password",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/public/change-pass`,
        user
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);
export const findUser = createAsyncThunk(
  "user/find",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/public/findUser`,
        formData.userName,
        { headers: { "Content-Type": "text/plain" } }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);
export const getUserDetail = createAsyncThunk(
  "user/getDetail",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      if (!token) {
        console.error("Token is missing or invalid");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/fetchUserDetail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the data if the request is successful
    } catch (e) {
      if (e.response) {
        // Handle specific error responses from the server
        return rejectWithValue(e.response.data);
      }
      // Handle network or other unexpected errors
      return rejectWithValue("Unexpected error");
    }
  }
);
export const getRoomMembers = createAsyncThunk(
  "get/roomMembers",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      if (!token) {
        console.error("Token is missing or invalid");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/chatroom/get/roomMembers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            roomKey: roomKey,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const setProfileImg = createAsyncThunk(
  "user/setImg",
  async (ImageData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/user-img`,
        ImageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        // Handle specific error responses from the server
        return rejectWithValue(e.response.data);
      }
      // Handle network or other unexpected errors
      return rejectWithValue("Unexpected error");
    }
  }
);
// Ai----------------------------------
export const ChatAi = createAsyncThunk(
  "ai/ask",
  async (question, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/qna/ask`,
        question,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const deleteProfileImg = createAsyncThunk(
  "user/deleteImg",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/delete-img`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const setGroupImg = createAsyncThunk(
  "room/setImg",
  async ({ ImageData, groupId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chatroom/group-img/${groupId}`,
        ImageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const deleteGroupImg = createAsyncThunk(
  "group/deleteImg",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/chatroom/delete-img/${roomKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const updateUser = createAsyncThunk(
  "user/update",
  async (user, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const updateGroup = createAsyncThunk(
  "chatRoom/update",
  async (chatRoom, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/chatroom/update-room`,
        chatRoom,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const createRoom = createAsyncThunk(
  "room/create",
  async (chatRoom, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chatroom/create`,
        chatRoom,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return (await response).data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const joinRoom = createAsyncThunk(
  "room/join",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chatroom/join-group`,
        roomKey,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        }
      );
      return (await response).data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const leaveGroup = createAsyncThunk(
  "room/leave",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chatroom/leave-group`,
        roomKey,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        }
      );
      return roomKey;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "room/delete",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/chatroom/delete/${roomKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return roomKey;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);


export const sendChatMedia = createAsyncThunk(
  "send/chatmedia",
  async ({ MediaData, groupId,message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      MediaData.append(
        "message",
        new Blob([JSON.stringify(message)], { type: "application/json" })
      );
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/sendChatMedia/${groupId}`,
        MediaData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const makeAdmin = createAsyncThunk(
  "group/makeAdmin",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chatroom/add-admin`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return body;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const removeAdmin = createAsyncThunk(
  "group/removeAdmin",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chatroom/remove-admin`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return body;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const removeMember = createAsyncThunk(
  "group/removeMember",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chatroom/remove-Member`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return body;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const deleteChat =createAsyncThunk(
  "chat/delete",
  async(body,{rejectWithValue})=>{
    try {
      const token = localStorage.getItem("chatAppToken");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/chat/delete/${body.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
        data:body.roomKey,
      });
      return body;
    }catch(e){
      if(e.response){
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
)
export const chatSlice = createSlice({
  name: "chatApp",
  initialState,
  reducers: {
    addMessageToGroup: (state, action) => {
      const { roomId, message } = action.payload;

      state.user.group = state.user.group.map((group) => {
        if (group.roomKey === roomId) {
          return {
            ...group,
            chat: [...group.chat, message],
          };
        }
        return group;
      });
    },
    removeMessageFromGroup: (state, action) => {
      const room = state.user.group.find((grp) => grp.roomKey === action.payload.roomKey);
      if (room) {
        room.chat = room.chat.filter((c) => c.id !== action.payload.id);
      } else {
        console.warn(`Room with roomKey ${action.payload.roomKey} not found.`);
      }
    },
    removeChatRoom:(state,action) =>{
      state.user.group=state.user.group.filter((g)=>g.roomKey!==action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        localStorage.setItem("chatAppToken", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        toast.error(action.payload || "Login failed. please try again.");
      })
      .addCase(sendEmail.fulfilled, (state) => {
        toast.success("Email Sent");
      })
      .addCase(sendEmail.rejected, (state) => {
        toast.error(action.payload || "Failed to send email");
      })
      .addCase(createUser.fulfilled, (state, action) => {
        toast.success("User created sucessfully");
      })
      .addCase(createUser.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(changePassword.rejected, (state, action) => {
        toast.error(action.payload || "Error in changing password");
      })
      .addCase(findUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(findUser.rejected,()=>{
        console.log("user not found");
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("chatAppUserDetail", action.payload);
      })
      .addCase(getUserDetail.pending, (state, action) => {
        state.isLoading=true;
      })
      .addCase(getUserDetail.rejected, (state) => {
        state.isLoading=false;
        localStorage.removeItem("chatAppToken");
        localStorage.removeItem("chatAppUserDetail");
        localStorage.removeItem("boxSizes");
        window.location.reload();
      })
      .addCase(setProfileImg.fulfilled, (state, action) => {
        state.user.userImageUrl = action.payload;
      })
      .addCase(deleteProfileImg.fulfilled, (state) => {
        state.user.userImageUrl = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(ChatAi.fulfilled, (state, action) => {
        state.user.aiQna = {
          ...state.user.aiQna,
          ...action.payload, 
        };
      })
      .addCase(ChatAi.rejected, (state, action) => {
        toast.error(action.payload || "Error in changing password");
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(joinRoom.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        const roomKey = action.meta.arg;
        state.user.group = state.user.group.filter(
          (group) => group.roomKey !== roomKey
        );
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        const roomKey = action.meta.arg;
        state.user.group = state.user.group.filter(
          (group) => group.roomKey !== roomKey
        );
      })

      .addCase(leaveGroup.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(deleteGroupImg.fulfilled, (state, action) => {
        const roomKey = action.meta.arg;
        state.user.group.find((g) => g.roomKey === roomKey).groupImageUrl = "";
      })
      .addCase(deleteGroupImg.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(setGroupImg.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(setGroupImg.fulfilled, (state, action) => {
        const roomKey = action.meta.arg.groupId;
        const group = state.user.group.find((g) => g.roomKey === roomKey);
        if (group) {
          group.groupImageUrl = action.payload;
        }
      })

      .addCase(updateGroup.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateGroup.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(getRoomMembers.fulfilled, (state, action) => {
        state.friends = { ...state.friends, ...action.payload };
        state.isLoading=false;
      })
      .addCase(getRoomMembers.rejected, (state, action) => {
        state.isLoading=false;
      })
      .addCase(getRoomMembers.pending, (state, action) => {
      })
      .addCase(makeAdmin.fulfilled, (state, action) => {
        const room = state.user.group.find(
          (grp) => grp.roomKey === action.payload.roomKey
        );
        if (room) {
          room.admin.push(action.payload.userId);
        }
      })
      .addCase(removeAdmin.fulfilled, (state, action) => {
        const room = state.user.group.find((grp) => grp.roomKey === action.payload.roomKey);
        if (room) {
            room.admin = room.admin.filter((id) => id !== action.payload.userId);
        }
    })
    .addCase(removeMember.fulfilled,(state,action)=>{
      const room = state.user.group.find((grp) => grp.roomKey === action.payload.roomKey);
        if (room) {
            room.admin = room.admin.filter((id) => id !== action.payload.userId);
            room.member = room.member.filter((id) => id !== action.payload.userId);
        }
    })
    .addCase(deleteChat.fulfilled,(state,action)=>{
      const room = state.user.group.find((grp) => grp.roomKey === action.payload.roomKey);
      room.chat=room.chat.filter((c)=>c.id!==action.payload.id)
    })
    .addCase(deleteChat.rejected,()=>{
      toast.error("Some error in deleting");
    })
  },
});

export default chatSlice.reducer;
export const { addMessageToGroup,removeMessageFromGroup ,removeChatRoom } = chatSlice.actions;
