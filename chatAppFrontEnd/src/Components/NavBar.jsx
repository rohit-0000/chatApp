import React, { useEffect, useRef, useState } from "react";
import defaultUserImg from "../assets/DefaultUser.svg";
import ChatImg from "../assets/Chat.svg";
import logout from "../assets/logout.svg";
import AiImg from "../assets/aiImg.svg";
import { NavLink } from "react-router";
import { getRoomMembers, getUserDetail } from "../Reducer/chatSlice";
import { useDispatch, useSelector } from "react-redux";
const NavBar = () => {
  const [isNavBarExpanded, setIsNavBarExpanded] = useState(false);
  const dispatch = useDispatch();
  const navBarRef = useRef(null);
  const user = useSelector((state) => state.chatApp.user);
  function handleNavBar() {
    setIsNavBarExpanded((prev) => !prev);
  }
  function HandleLogOut() {
    localStorage.removeItem("chatAppToken");
    localStorage.removeItem("chatAppUserDetail");
    localStorage.removeItem("boxSizes");
    window.location.reload();
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navBarRef.current && !navBarRef.current.contains(event.target)) {
        setIsNavBarExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div
      ref={navBarRef}
      className={`${
        isNavBarExpanded ? "w-[200px]" : "w-14"
      } h-screen border-r fixed bottom-0 left-0 flex flex-col items-start justify-between py-5 z-50 bg-slate-950 transition-all duration-200 ease-linear overflow-hidden`}
    >
      {/* Upper Nav */}
      <div className="flex flex-col gap-5 w-full ">
        {/* NavButton */}
        <button
          className={`flex justify-center gap-2 items-center cursor-pointer rounded  active:scale-95 ${
            isNavBarExpanded ? " justify-start mx-2 " : "w-fit self-center"
          } p-0.5 text-3xl transition-all duration-500 ease-linear`}
          onClick={handleNavBar}
        >
          ☰
        </button>
        {/* chat */}
        <NavLink
          to={"/home"}
          className={({ isActive }) =>
            `flex justify-center gap-2 items-center cursor-pointer hover:bg-[#ffffff20] rounded  active:scale-95 ${
              isActive ? "bg-blue-600" : ""
            }  ${
              isNavBarExpanded ? " justify-start mx-2 " : "w-fit self-center"
            } p-0.5 transition-all duration-500 ease-linear`
          }
        >
          <img src={ChatImg} className="  max-w-10 max-h-10 " />
          <div
            className={`text-xl ${
              isNavBarExpanded
                ? "opacity-100 w-fit block"
                : "opacity-0 w-0 absolute"
            } transition-all duration-100 ease-linear`}
          >
            {" "}
            Chats{" "}
          </div>
        </NavLink>
        {/* jm */}
        <NavLink
          to={"/ai"}
          className={({ isActive }) =>
            `flex justify-center gap-2 items-center cursor-pointer hover:bg-[#ffffff20] rounded  active:scale-95 ${
              isActive ? "bg-blue-600" : ""
            }  ${
              isNavBarExpanded ? " justify-start mx-2 " : "w-fit self-center"
            } p-0.5 transition-all duration-500 ease-linear`
          }
        >
          <img src={AiImg} className="  max-w-11 max-h-11 " />
          <div
            className={`text-xl ${
              isNavBarExpanded
                ? "opacity-100 w-fit block"
                : "opacity-0 w-0 absolute"
            } transition-all duration-100 ease-linear`}
          >
            {" "}
            AI{" "}
          </div>
        </NavLink>
      </div>

      {/* Lower Nav */}
      <div className="flex flex-col gap-5 w-full ">
        {/*Profile  */}
        <NavLink
          to={"/profile"}
          className={({ isActive }) =>
            `flex justify-center gap-2 items-center cursor-pointer hover:bg-[#ffffff20] rounded  active:scale-95 ${
              isActive ? "bg-blue-900" : ""
            }  ${
              isNavBarExpanded ? " justify-start mx-2 " : "w-fit self-center"
            } p-0.5 transition-all duration-500 ease-linear`
          }
        >
          <img
            src={user?.userImageUrl || defaultUserImg}
            className=" w-10 h-10 object-cover rounded-full p-0.5 aspect-[1/1]"
          />
          <div
            className={`text-xl ${
              isNavBarExpanded
                ? "opacity-100 w-fit block"
                : "opacity-0 w-0 absolute"
            } transition-all duration-100 ease-linear`}
          >
            {" "}
            Profile{" "}
          </div>
        </NavLink>
        {/* Logout */}
        <div
          className={`flex justify-center gap-2 items-center cursor-pointer  hover:bg-red-500 rounded  active:scale-95  ${
            isNavBarExpanded ? " justify-start mx-2 " : "w-fit self-center"
          } `}
          onClick={HandleLogOut}
        >
          <img src={logout} className=" max-w-10 max-h-10 p-1 ml-1" />
          <div
            className={`text-xl ${
              isNavBarExpanded
                ? "opacity-100 w-fit block"
                : "opacity-0 w-0 absolute"
            } transition-all duration-100 ease-linear `}
          >
            {" "}
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
