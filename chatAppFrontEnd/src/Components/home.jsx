import React, { useRef, useState, useEffect } from "react";
import CreateImg from "../assets/createImg.svg";
import SearchImg from "../assets/searchImg.svg";
import JoinGroupImg from "../assets/joinGroupImg.svg";
import { useDispatch, useSelector } from "react-redux";
import DefaultGroup from "../assets/defaultGroup.svg";
import GroupEditImg from "../assets/groupEditImg.svg";
import defaultUserImg from "../assets/DefaultUser.svg";
import BackImg from "../assets/backImg.svg";
import sendImg from "../assets/sendImg.svg";
import videoCall from "../assets/videoCall.svg";
import audioCall from "../assets/audioCall.svg";
import CreateGroup from "./createGroup";
import JoinGroup from "./joinGroup";
import GroupInfo from "./groupInfo";
import { sendMessage } from "../Utils/websocket";
import AddImg from "../assets/addImg.svg";
import {
  addMessageToGroup,
  deleteChat,
  removeMessageFromGroup,
  sendChatMedia,
} from "../Reducer/chatSlice";
import downloadImg from "../assets/downloadImg.svg";
import fileImg from "../assets/fileImg.svg";
import DeleteImg from "../assets/deleteImg.svg";
import ObjectID from "bson-objectid";
import imgPrev from "../assets/imgPrev.svg";
import videoPrev from "../assets/videoPrev.svg";
import audioPrev from "../assets/audioPrev.svg";
import pdfPrev from "../assets/pdfPrev.svg";
import filePrev from "../assets/filePrev.svg";
import Pdf from "react-pdf-js";

const Home = () => {
  const leftBoxRef = useRef(null);
  const rightBoxRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const user = useSelector((state) => state.chatApp.user);
  const [roomCreateForm, setRoomCreateForm] = useState(false);
  const [roomJoinForm, setRoomJoinForm] = useState(false);
  const createRoomBtn = useRef(null);
  const joinRoomBtn = useRef(null);
  const addBtnRef = useRef(null);
  const groupInfoRef = useRef(null);
  const [groupNo, setGroupNo] = useState(null);
  const [addGroup, setAddGroup] = useState(false);
  const [OpenGroupInfo, setOpenGroupInfo] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const [fullImg, setFullImg] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const [search, setSearch] = useState("");
  const filteredGroups = user?.group?.filter((grp) =>
    grp?.roomName?.toLowerCase().includes(search.toLowerCase())
  );
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState("");
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState([]);
  const [toDeleteChat, setToDeleteChat] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [sizes, setSizes] = useState({ left: 30, right: 70 });

  useEffect(() => {
    if (isSmallScreen) {
      setSizes({ left: 100, right: 100 });
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("boxSizes", JSON.stringify(sizes));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sizes]);

  const handleMouseDown = () => {
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", handleMouseMove);
        setIsDragging(false);
      },
      { once: true }
    );
  };

  const handleMouseMove = (e) => {
    const totalWidth = window.innerWidth;
    const newLeftWidth =
      ((leftBoxRef.current.offsetWidth + e.movementX) / totalWidth) * 100;
    const newRightWidth =
      ((rightBoxRef.current.offsetWidth - e.movementX) / totalWidth) * 100;
    setSizes({
      left: newLeftWidth,
      right: newRightWidth,
    });
  };

  // message send
  function handleSendMessage() {
    if (message === "" && file === null) return;
    if (file !== null) {
      const msg = {
        id: new ObjectID().toHexString(),
        senderId: user.id,
        senderName: user.name,
        senderImg: user.userImageUrl,
        message: preview,
        public_Id: "public_ID",
        time: new Date().toISOString(),
        msgType: fileType,
        fileName: file.name,
      };
      setLoading((load) => [...load, msg.id]);
      dispatch(addMessageToGroup({ roomId: groupNo, message: msg }));
      const formData = new FormData();
      formData.append("chatFile", file);

      setFile(null);
      setFileType(null);
      setPreview(null);
      fileInputRef.current.value = "";

      dispatch(
        sendChatMedia({ MediaData: formData, groupId: groupNo, message: msg })
      );

      setLoading((load) => load.filter((id) => id != msg.id));
    } else {
      const msg = {
        id: new ObjectID().toHexString(),
        senderId: user.id,
        message: message,
        time: new Date().toISOString(),
        senderName: user.name,
        senderImg: user.userImageUrl,
        msgType: "text",
      };
      dispatch(addMessageToGroup({ roomId: groupNo, message: msg }));
      sendMessage(groupNo, msg);
      setMessage("");
      textareaRef.current.style.height = "auto";
    }
  }

  //handle click outside
  useEffect(() => {
    const handleClickOutside_CreateRoom = (event) => {
      if (
        roomCreateForm === true &&
        createRoomBtn.current &&
        !createRoomBtn.current.contains(event.target)
      ) {
        setRoomCreateForm(false);
      }
    };
    const handleClickOutside_JoinRoom = (event) => {
      if (
        roomJoinForm === true &&
        joinRoomBtn.current &&
        !joinRoomBtn.current.contains(event.target)
      ) {
        setRoomJoinForm(false);
      }
    };
    const handleClickOutside_addBtn = (event) => {
      if (
        addGroup === true &&
        addBtnRef.current &&
        !addBtnRef.current.contains(event.target)
      ) {
        setAddGroup(false);
      }
    };
    const handleClickOutside_GroupInfo = (event) => {
      if (
        OpenGroupInfo === true &&
        groupInfoRef.current &&
        !groupInfoRef.current.contains(event.target)
      ) {
        setOpenGroupInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside_CreateRoom);
    document.addEventListener("mousedown", handleClickOutside_JoinRoom);
    document.addEventListener("mousedown", handleClickOutside_addBtn);
    document.addEventListener("mousedown", handleClickOutside_GroupInfo);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside_CreateRoom);
      document.removeEventListener("mousedown", handleClickOutside_JoinRoom);
      document.removeEventListener("mousedown", handleClickOutside_addBtn);
      document.removeEventListener("mousedown", handleClickOutside_GroupInfo);
    };
  }, [roomCreateForm, roomJoinForm, addGroup, OpenGroupInfo]);

  // render Preview
  const renderPreview = () => {
    if (!preview) return null;

    if (fileType === "image") {
      return (
        <img src={preview} alt="preview" className="w-[200px] md:w-[350px]" />
      );
    } else if (fileType === "audio") {
      return <audio controls src={preview} />;
    } else if (fileType === "video") {
      return (
        <video
          controls
          src={preview}
          className="w-[100px] md:w-[250px] md:max-w-350px"
        />
      );
    } else if (fileType === "pdf") {
      return (
        <div className="w-62 md:w-70 ">
          <iframe
            src={preview}
            className=" h-90 flex justify-center items-center "
            title="PDF Preview"
          />
        </div>
      );
    } else if (fileType === "doc") {
      return <p className="bg-blue-400 rounded-2xl p-5">{file.name}</p>;
    } else {
      return <p>Unsupported file type</p>;
    }
  };

  // handle File Change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    console.log(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    let secureUrl = url.startsWith("http://")
      ? url.replace("http://", "https://")
      : url;

    setFile(selectedFile);
    setPreview(secureUrl);
    setFileType(getFileType(selectedFile));
  };

  // get File Type
  function getFileType(fileType) {
    if (fileType.type.startsWith("image/")) return "image";
    else if (fileType.type.startsWith("video/")) return "video";
    else if (fileType.type.startsWith("audio/")) return "audio";
    else if (fileType.type === "application/pdf") return "pdf";
    else if (
      fileType.name.toLowerCase().endsWith(".doc") ||
      fileType.name.toLowerCase().endsWith(".docx") ||
      fileType.name.toLowerCase().endsWith(".ppt") ||
      fileType.name.toLowerCase().endsWith(".pptx")
    )
      return "doc";
    else return "unknown";
  }

  function showMediaChat(unSecureUrl, type, name) {
    {
      let url = unSecureUrl.startsWith("http://")
        ? unSecureUrl.replace("http://", "https://")
        : unSecureUrl;
      if (type === "image")
        return (
          <div className="relative">
            <img
              src={downloadImg}
              className="w-6 absolute right-2 -top-5 active:scale-90 cursor-pointer"
              onClick={async () => {
                const blob = await (await fetch(url)).blob();
                const link = Object.assign(document.createElement("a"), {
                  href: URL.createObjectURL(blob),
                  download: name,
                });
                link.click();
              }}
              alt="Download"
            />
            <a href={url} target="_blank">
              <img
                src={url}
                className="w-50 md:w-80 px-1 py-2 rounded-2xl cursor-pointer"
              />
            </a>
          </div>
        );
      else if (type === "video")
        return (
          <div>
            <img
              src={downloadImg}
              className="w-6 absolute right-2 -top-5 active:scale-90 cursor-pointer"
              onClick={async () => {
                const blob = await (await fetch(url)).blob();
                const link = Object.assign(document.createElement("a"), {
                  href: URL.createObjectURL(blob),
                  download: name,
                });
                link.click();
              }}
              alt="Download"
            />
            <video src={url} controls className="w-50 md:w-80 rounded-2xl" />
          </div>
        );
      else if (type === "audio")
        return (
          <div>
            <img
              src={downloadImg}
              className="w-6 absolute right-2 -top-5 active:scale-90 cursor-pointer"
              onClick={async () => {
                const blob = await (await fetch(url)).blob();
                const link = Object.assign(document.createElement("a"), {
                  href: URL.createObjectURL(blob),
                  download: name,
                });
                link.click();
              }}
              alt="Download"
            />
            <audio src={url} controls className="w-60 md:w-80 " />
          </div>
        );
      else if (type === "pdf") {
        return (
          <div className="relative">
            <img
              src={downloadImg}
              className="w-6 absolute right-2 -top-7 active:scale-90 cursor-pointer"
              onClick={async () => {
                const blob = await (await fetch(url)).blob();
                const link = Object.assign(document.createElement("a"), {
                  href: URL.createObjectURL(blob),
                  download: name,
                });
                link.click();
              }}
              alt="Download"
            />
            <iframe src={url} className="w-55 md:w-75 h-90 cursor-pointer" />
            <a href={url} className="border px-2 py-1 rounded-xl bg-blue-600">
              Open Pdf
            </a>
          </div>
        );
      } else if (type === "doc")
        return (
          <div>
            <img
              src={downloadImg}
              className="w-6 absolute right-2 -top-5 active:scale-90 cursor-pointer"
              onClick={async () => {
                const blob = await (await fetch(url)).blob();
                const link = Object.assign(document.createElement("a"), {
                  href: URL.createObjectURL(blob),
                  download: name,
                });
                link.click();
              }}
              alt="Download"
            />
            <a
              download={name}
              href={url}
              className="bg-blue-400 rounded-2xl p-4 block"
            >
              <p>{name}</p>
            </a>
          </div>
        );
      else
        return (
          <div>
            <img
              src={downloadImg}
              className="w-6 absolute right-2 -top-5 active:scale-90 cursor-pointer"
              onClick={async () => {
                const blob = await (await fetch(url)).blob();
                const link = Object.assign(document.createElement("a"), {
                  href: URL.createObjectURL(blob),
                  download: name,
                });
                link.click();
              }}
              alt="Download"
            />
            <a download={name} href={url}>
              <img src={fileImg} className="w-45" />
            </a>
            <p>{name}</p>
          </div>
        );
    }
  }

  function showMediaChatPreview(type,grp) {
    if (type === "text") {
      return (
        <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
          {grp?.chat[grp.chat.length - 1]?.message}
        </div>
      );
    } else if (type === "image") {
      return (
        <div className="flex gap-1">
          <img src={imgPrev} className="w-4" />
          <p>Image file</p>
        </div>
      );
    } else if (type === "video") {
      return (
        <div className="flex gap-1">
          <img src={videoPrev} className="w-4" />
          <p>Video file</p>
        </div>
      );
    } else if (type === "audio") {
      return (
        <div className="flex gap-1">
          <img src={audioPrev} className="w-4" />
          <p>Audio file</p>
        </div>
      );
    } else if (type === "pdf") {
      return (
        <div className="flex gap-1">
          <img src={pdfPrev} className="w-4" />
          <p>PDF file</p>
        </div>
      );
    } else if(type==="unknown"){
      return (
        <div className="flex gap-1">
          <img src={filePrev} className="w-4" />
          <p>File</p>
        </div>
      );
    }
  }

  //Time conversion
  function getTime(dateString) {
    const date = new Date(dateString);

    // Array of month abbreviations
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  return (
    <div
      className={`overflow-hidden h-screen w-screen ${
        !fullImg && "p-2"
      } flex gap-1 relative transition-all duration-400 ease-in`}
    >
      <div
        className={`${
          fullImg
            ? "w-screen h-screen opacity-100 scale-100 left-0"
            : "left-1/2 w-0 h-0 overflow-hidden opacity-0 scale-0 "
        } bg-slate flex justify-center items-center z-99  backdrop-blur-2xl transition-all duration-500 ease-in-out absolute `}
      >
        <img
          src={BackImg}
          className="absolute w-10 top-4 left-4 cursor-pointer"
          onClick={() => setFullImg(false)}
        />
        <img
          src={
            user?.group?.find((grp) => grp?.roomKey === groupNo)
              ?.groupImageUrl || DefaultGroup
          }
          className="aspect-[1/1] max-w-full max-h-full object-cover p-2 rounded-2xl"
        />
      </div>
      {/* Main Box */}
      <div className="flex rounded-2xl h-full w-full overflow-hidden border-white pl-14 gap-0">
        {/* left Box */}
        <div
          ref={leftBoxRef}
          className={`h-full  relative rounded-l-2xl bg-[#fff1d53a] ${
            groupNo !== null && "hidden md:flex"
          } flex flex-col justify-center gap-2 md:min-w-80 `}
          style={
            !isSmallScreen ? { width: `${sizes.left}vw` } : { width: "100%" }
          }
        >
          {/* left top */}
          <div className="flex flex-col gap-2">
            <div className="w-full h-18 rounded-tl-2xl flex justify-between items-center px-4 border-b-8 border-slate-950 relative ">
              <h1 className="text-2xl font-bold">Chats</h1>
              {/* create or join group button */}
              <button
                className="cursor-pointer z-10 active:scale-90"
                onClick={() => setAddGroup(!addGroup)}
              >
                <img src={GroupEditImg} className="w-11" />
              </button>

              {/* enable create or join group button */}
              {addGroup && (
                <div
                  className="absolute -bottom-28 right-2 bg-[#00000040] w-fit h-fit px-4 py-2 rounded backdrop-blur-md flex flex-col gap-2"
                  ref={addBtnRef}
                >
                  <button
                    className="flex items-center gap-2 hover:border-1 px-2 py-1 rounded-md cursor-pointer"
                    onClick={() => {
                      setRoomJoinForm(true);
                    }}
                  >
                    <img src={JoinGroupImg} className="w-10 p-1 " />
                    <p className="font-bold">Join Group</p>
                  </button>

                  <button
                    className="flex items-center gap-2 hover:border-1 px-2 py-1 rounded-md cursor-pointer"
                    onClick={() => {
                      setRoomCreateForm(true);
                    }}
                  >
                    <img src={CreateImg} className="w-10" />
                    <p className="font-bold">Create Group</p>
                  </button>
                </div>
              )}
            </div>

            <div className="mx-3 bg-slate-950 rounded-xl flex items-center px-2">
              <img src={SearchImg} className="h-7" />
              <input
                className="w-full h-12 pl-2 text-xl outline-0 rounded-xl "
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search != "" && (
                <p
                  className="text-gray-500 font-extrabold text-2xl cursor-pointer"
                  onClick={() => setSearch("")}
                >
                  &#10005;
                </p>
              )}
            </div>
          </div>

          {/* groups */}
          <div className="w-full h-full rounded-bl-2xl p-2 flex flex-col gap-1 ">
            {Array.isArray(filteredGroups) && filteredGroups.length > 0 ? (
              filteredGroups
                .slice()
                .sort((a, b) => {
                  const timeA = new Date(
                    a.chat?.[a.chat.length - 1]?.time || a.createdAt
                  );
                  const timeB = new Date(
                    b.chat?.[b.chat.length - 1]?.time || b.createdAt
                  );
                  return timeB - timeA;
                })
                .map(
                  (grp, index) =>
                    grp && (
                      <div
                        key={index}
                        className={`flex gap-1 items-center ${
                          grp.roomKey === groupNo && "bg-slate-900 rounded-xl"
                        } p-1 transition-all duration-500 ease-out w-full h-18`}
                        onClick={() => {
                          setGroupNo(grp?.roomKey);
                        }}
                      >
                        <div>
                          <img
                            src={grp?.groupImageUrl || DefaultGroup}
                            className="w-12 h-12 object-cover rounded-full p-1"
                          />
                        </div>
                        <div className="w-full overflow-hidden">
                          <div className="font-bold">{grp.roomName}</div>
                          <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                            <div>
                              {showMediaChatPreview(
                                grp?.chat[grp.chat.length - 1]?.msgType,grp
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )
            ) : (
              <p className="text-center text-gray-500">No groups available</p>
            )}
          </div>

          {/* center line */}
          <div
            className={`h-full hidden md:block md:absolute right-[-0px] top-0 cursor-ew-resize border border-[#fff1d513] rounded ${
              isDragging
                ? "w-0.5 bg-blue-500"
                : "hover:w-1 hover: bg-neutral-400"
            } `}
            onMouseDown={handleMouseDown}
          ></div>
        </div>

        {/* Room Create Form */}
        {roomCreateForm && (
          <div className="absolute left-0 top-0 h-screen w-screen bg-[#0000005e] backdrop-blur-md z-50 flex justify-center items-center">
            <CreateGroup
              setRoomCreateForm={setRoomCreateForm}
              ref={createRoomBtn}
            />
          </div>
        )}
        {/* Room Join Form */}
        {roomJoinForm && (
          <div className="absolute left-0 top-0 h-screen w-screen bg-[#0000005e] backdrop-blur-md z-50 flex justify-center items-center">
            <JoinGroup setRoomJoinForm={setRoomJoinForm} ref={joinRoomBtn} />
          </div>
        )}

        {/* rightBox */}
        <div
          ref={rightBoxRef}
          className={`h-full  md:block  border-dotted rounded-l-2xl md:rounded-l-none rounded-r-2xl bg-[#ffffff2a] relative  md:min-w-100 ${
            groupNo === null ? "hidden" : ""
          } `}
          style={
            !isSmallScreen ? { width: `${sizes.right}vw` } : { width: "100%" }
          }
        >
          {groupNo == null ? (
            ""
          ) : (
            <div className="flex flex-col justify-between h-full">
              {/* right top  */}
              <div className="flex bg-[#02061892] h-22 rounded-tr-2xl ">
                {groupNo !== null && (
                  <button
                    onClick={() => {
                      setGroupNo(null);
                    }}
                    className="md:hidden"
                  >
                    <img src={BackImg} className="w-6 ml-2" />
                  </button>
                )}
                <div className="w-full flex items-center gap-3 px-5 justify-between">
                  <div
                    className="flex gap-3 items-center w-full"
                    onClick={() => {
                      setOpenGroupInfo(!OpenGroupInfo);
                    }}
                  >
                    <img
                      src={
                        user?.group?.find((group) => group?.roomKey === groupNo)
                          ?.groupImageUrl || DefaultGroup
                      }
                      className="w-13 h-13 rounded-full object-cover"
                    />
                    <p className="overflow-hidden text-ellipsis w-[60%]">
                      {
                        user?.group?.find((group) => group?.roomKey === groupNo)
                          ?.roomName
                      }
                    </p>
                  </div>
                  <div className="flex border border-gray-500 rounded-xl px-2 py-1">
                    <button
                      className="border-r border-gray-500 pr-1.5 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <img
                        src={videoCall}
                        className="w-6 md:w-9 mr-1.5 cursor-pointer active:scale-90"
                      />
                    </button>
                    <button
                      className=" pl-1.5 cursor-pointer  border-gray-500 active:scale-90"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <img src={audioCall} className="w-6 md:w-9" />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`absolute top-2 left-2 bg-[#02061892] backdrop-blur-xl   overflow-y-scroll pr-5  ${
                  OpenGroupInfo
                    ? "opacity-100 h-120 w-80 left-0 rounded-lg"
                    : "opacity-0 h-0 w-0 left-40 rounded-4xl no-scrollbar"
                } transition-all duration-400 ease-in z-90`}
              >
                <GroupInfo
                  group={user?.group?.find(
                    (group) => group?.roomKey === groupNo
                  )}
                  id={user.id}
                  ref={groupInfoRef}
                  setGroupNo={setGroupNo}
                  groupNo={groupNo}
                  setFullImg={setFullImg}
                  OpenGroupInfo={OpenGroupInfo}
                  user={user}
                />
              </div>

              {/* chat */}
              <div className="h-full px-3 py-2 flex flex-col-reverse gap-3 overflow-y-scroll  no-scrollbar w-full">
                {user?.group
                  ?.find((group) => group?.roomKey === groupNo)
                  ?.chat?.slice()
                  .reverse()
                  .map((m, index) => (
                    <div
                      key={index}
                      className={`${
                        user.id === m?.senderId
                          ? "self-end flex-row-reverse"
                          : "self-start"
                      } w-fit text-white flex gap-5 `}
                      onMouseEnter={() => {
                        console.log("Mouse entered:", m.id);
                        setToDeleteChat(m.id);
                      }}
                      onMouseLeave={() => {
                        console.log("Mouse left:", m.id);
                        setToDeleteChat(null);
                      }}
                    >
                      <div className="flex">
                        {user.id !== m.senderId && (
                          <img
                            src={m.senderImg || defaultUserImg}
                            className="w-10 h-10 object-cover rounded-full bg-slate-950 mr-2"
                          />
                        )}
                        <div
                          className={`${
                            m?.senderId === user?.id
                              ? "bg-gradient-to-r from-indigo-800  to-purple-800 rounded-tr-none"
                              : "bg-blue-950 rounded-tl-none"
                          } min-w-30 rounded-xl `}
                        >
                          <div className="">
                            <div className="text-xs italic text-amber-400 pl-2 pt-2 ">
                              <p className="overflow-hidden text-ellipsis pr-2">
                                ~{m?.senderName && m.senderName}
                              </p>
                            </div>
                            {m.public_Id ? (
                              <div className="px-2 pt-3 rounded-2xl relative">
                                {showMediaChat(
                                  m?.message,
                                  m?.msgType,
                                  m?.fileName
                                )}
                                <p className="font-extralight text-[0.7rem] text-end">
                                  {getTime(m?.time)}
                                </p>
                                {loading.find((id) => id == m?.id) && (
                                  <div className="absolute p-2 top-0 left-0 h-full w-full  flex justify-center items-center ">
                                    <div className="w-10 h-10 border-5 border-transparent animate-spin  border-t-red-400 rounded-full" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="px-1 pb-1">
                                <p className="whitespace-pre-wrap w-fit px-5 pb-1">
                                  {m?.message}
                                </p>
                                <p className="font-extralight text-[0.7rem] text-end">
                                  {getTime(m?.time)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {!OpenGroupInfo &&
                          toDeleteChat === m.id &&
                          (m.senderId === user.id ||
                            user.group
                              .find((grp) => grp.roomKey === groupNo)
                              .admin.find((id) => id === user.id)) && (
                            <img
                              src={DeleteImg}
                              className="h-6 active:scale-90 cursor-pointer"
                              onClick={() => {
                                const body = {
                                  id: toDeleteChat,
                                  roomKey: groupNo,
                                };
                                dispatch(
                                  removeMessageFromGroup({
                                    roomKey: groupNo,
                                    id: toDeleteChat,
                                  })
                                );
                                dispatch(deleteChat(body));
                              }}
                            />
                          )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* send message */}
              <div className="bg-slate-900 h-fit rounded-br-2xl flex justify-between items-center relative">
                <div>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      disabled={file}
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    {!file && <img src={AddImg} className="h-10 px-2" />}
                    {file && (
                      <p
                        className="h-10 w-10 px-2 font-bold text-3xl"
                        onClick={(e) => {
                          setFileType(null);
                          setPreview(null);
                          setFile(null);
                          fileInputRef.current.value = "";
                        }}
                      >
                        &#10005;
                      </p>
                    )}
                  </label>
                  <div
                    className={`absolute bottom-20 left-2 rounded overflow-hidden border-y-10 border-x-5 border-gray-600 bg-gray-600 flex ${
                      !file && "hidden"
                    }`}
                  >
                    {renderPreview()}
                  </div>
                </div>
                <textarea
                  placeholder="Type a message "
                  className="w-full resize-none outline-0 px-3 my-2 max-h-50"
                  rows={2}
                  value={message}
                  onInput={(e) => {
                    e.target.style.height = `auto`;
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  disabled={file}
                  ref={textareaRef}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Prevents new line
                      handleSendMessage(); // Call function to send message
                    }
                  }}
                />
                <button onClick={handleSendMessage}>
                  <img src={sendImg} className="h-8  mr-2 active:scale-90" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
