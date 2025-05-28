import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./Components/login";
import Signup from "./Components/signup";
import Forgot_pass from "./Components/forgot_pass";
import Otp_verify from "./Components/otp_verify";
import Home from "./Components/home";
import Change_password from "./Components/change_password";
import Profile from "./Components/profile";
import AI from "./Components/ai";
import NavBar from "./Components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect} from "react";
import { connectToAllRooms } from "./Utils/websocket";
import LoadingImg from "./assets/chatAppLogo.png";

import {
  addMessageToGroup,
  removeMessageFromGroup,
  removeChatRoom,
  getUserDetail,
  getRoomMembers,
} from "./Reducer/chatSlice";
import OAuth2RedirectHandler from "./Components/OAuth2RedirectHandler ";

function App() {
  const token = localStorage.getItem("chatAppToken");
  const loading=useSelector((state)=>state.chatApp.isLoading);
  const router = createBrowserRouter([
    {
      path: "/",
      element: token ? (
        <Navigate to="/home" />
      ) : (
        <div>
          <Login />
        </div>
      ),
    },
    {
      path: "/signup",
      element: token ? (
        <Navigate to="/home" />
      ) : (
        <div>
          <Signup />
        </div>
      ),
    },
    {
      path: "/oauth2/redirect",
      element: <OAuth2RedirectHandler />,
    },
    {
      path: "/forgot-password",
      element: (
        <div>
          <Forgot_pass />
        </div>
      ),
    },
    {
      path: "/verify-otp",
      element: (
        <div>
          <Otp_verify />
        </div>
      ),
    },
    {
      path: "/change-pass",
      element: token ? (
        <Navigate to="/home" />
      ) : (
        <div>
          <Change_password />
        </div>
      ),
    },
    {
      path: "/home",
      element: token ? (
        <div>
          <NavBar />
          <Home />
        </div>
      ) : (
        <Navigate to={"/"} />
      ),
    },
    {
      path: "/profile",
      element: token ? (
        <div>
          <NavBar />
          <Profile />
        </div>
      ) : (
        <Navigate to={"/"} />
      ),
    },
    {
      path: "/ai",
      element: token ? (
        <div>
          <NavBar />
          <AI />
        </div>
      ) : (
        <Navigate to={"/"} />
      ),
    },
  ]);
  const dispatch = useDispatch();
  const roomIds = useSelector((state) =>
    state.chatApp.user?.group?.map((g) => g?.roomKey)
  );
  const user = useSelector((state) => state.chatApp.user);

  useEffect(() => {
    if (roomIds == null || roomIds === "") return;
    const client = connectToAllRooms(
      roomIds,
      (roomId, message) => {
        if (message.senderId !== user.id) {
          dispatch(addMessageToGroup({ roomId, message }));
        }
      },
      (roomId, deletedMessageId) => {
        // Pass the onMessageDeleted function
        dispatch(
          removeMessageFromGroup({ roomKey: roomId, id: deletedMessageId })
        );
      },
      (roomKey) => {
        dispatch(removeChatRoom(roomKey));
      }
    );
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [roomIds]);
  useEffect(() => {
    if (token) {
      dispatch(getUserDetail());
    }
  }, [token]);

  useEffect(() => {
    if (user?.group) {
      user.group.forEach((group) => {
        dispatch(getRoomMembers(group?.roomKey));
      });
    }
  }, [user]);
  return (
    <div className="text-white relative w-screen h-screen flex justify-center items-center">
      <RouterProvider router={router} />
      {loading && (
        <div className="absolute left-0 top-0 w-screen h-screen z-99 inset-0 backdrop-blur-md flex justify-center items-center bg-[#020618bf]">
          <img
            src={LoadingImg}
            className="aspect-square object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default App;
