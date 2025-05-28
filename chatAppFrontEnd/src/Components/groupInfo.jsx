import React, { useEffect, useRef, useState } from "react";
import DefaultRoomImg from "../assets/defaultGroup.svg";
import DefaultUserImg from "../assets/DefaultUser.svg";
import EditImg from "../assets/editTextImg.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteGroup,
  deleteGroupImg,
  leaveGroup,
  makeAdmin,
  removeAdmin,
  removeMember,
  setGroupImg,
  updateGroup,
} from "../Reducer/chatSlice.jsx";
import toast from "react-hot-toast";
const groupInfo = (props) => {
  const group = props.group;
  const [description, setDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");
  const friends = useSelector((state) => state.chatApp.friends);
  const [name, setName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const dispatch = useDispatch();
  const [hoverImg, setImgHover] = useState(false);
  const [ImgClick, setImgClick] = useState(false);
  const setFullImg = props.setFullImg;
  const [overview, setOverview] = useState(true);
  const imgClickRef = useRef(null);
  const createdAt = group?.createdAt
    ? new Date(group.createdAt)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-") +
      " " +
      new Date(group.createdAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";
  const admin = group?.admin?.find((admin) => admin === props.id);
  const [loading, setLoading] = useState(false);
  const [activeMemberIndex, setActiveMemberIndex] = useState(null);
  const activeMemberRef = useRef(null);

  function handleImgInput(e) {
    const img = e.target.files[0];
    setImgClick(false);
    if (img && img.type.startsWith("image/")) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", img);
      dispatch(
        setGroupImg({ ImageData: formData, groupId: group.roomKey })
      ).then(() => setLoading(false));
    } else {
      toast.error("Invalid file type");
    }
  }
  function handleSaveDescription() {
    if (descriptionInput === "") {
      toast.error("Description can not be empty");
      setDescription(false);
      return;
    }
    const chatRoom = {
      roomKey: group?.roomKey,
      description: descriptionInput,
    };
    dispatch(updateGroup(chatRoom));
    setDescription(() => !description);
  }
  function handleSaveName() {
    if (nameInput === "") {
      toast.error("Name can not be empty");
      setName(false);
      return;
    }
    const chatRoom = {
      roomKey: group?.roomKey,
      roomName: nameInput,
    };
    dispatch(updateGroup(chatRoom));
    setName(() => !name);
  }
  function handleDeleteGroupImg() {
    dispatch(deleteGroupImg(group.roomKey));
    setImgClick(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ImgClick === true &&
        imgClickRef.current &&
        !imgClickRef.current.contains(event.target)
      ) {
        setImgClick(false);
      }
    };
    const handleClickOutside_forActiveMembers = (event) => {
      if (
        activeMemberIndex !== null &&
        activeMemberRef.current &&
        !activeMemberRef.current.contains(event.target)
      ) {
        setActiveMemberIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside_forActiveMembers);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener(
        "mousedown",
        handleClickOutside_forActiveMembers
      );
    };
  }, [ImgClick, activeMemberIndex]);

  return (
    <div
      className={`flex flex-col  gap-1  px-5 pb-10 pt-5 ${
        props.OpenGroupInfo
          ? "opacity-100 w-full h-full"
          : "opacity-0 w-0 h-0 no-scrollbar"
      } transition-all duration-200 ease-in-out`}
      ref={props.ref}
    >
      <div className="flex w-full justify-around mb-5 text-xl">
        <button
          className={`active:scale-75 ${
            overview && "border-b-3"
          } px-3 pb-1 rounded border-green-500 hover:bg-[#ffffff35] cursor-pointer`}
          onClick={() => setOverview(true)}
        >
          Overview
        </button>
        <button
          className={`active:scale-75 ${
            !overview && "border-b-3"
          } px-3 pb-1 rounded border-green-500 hover:bg-[#ffffff35] cursor-pointer`}
          onClick={() => setOverview(false)}
        >
          Members
        </button>
      </div>
      {overview ? (
        // {/* Overview section */}
        <div className="flex flex-col ">
          {/* Image */}
          <div className="self-center relative">
            <img
              src={group?.groupImageUrl ? group?.groupImageUrl : DefaultRoomImg}
              className={` w-30 h-30 z-20 self-center   rounded-xl object-cover`}
              onMouseEnter={() => {
                setImgHover(true);
              }}
              onMouseLeave={() => {
                setImgHover(false);
              }}
            />
            {loading && (
              <div className="absolute w-30 h-30 p-6 rounded-xl self-center cursor-pointer bg-[#00000075] top-0">
                <div className="w-16 h-16 border-5 border-transparent animate-spin  border-t-blue-400 rounded-full flex justify-center items-center">
                  <div
                    className="w-10 h-10 border-5 border-transparent animate-spin  border-t-red-400 rounded-full"
                    div
                  />
                </div>
              </div>
            )}
            {hoverImg && (
              <img
                src={EditImg}
                className="absolute top-0 w-30 h-30 bg-[#000000a7] p-6 rounded-xl self-center cursor-pointer"
                // onClick={handleImgClick}
                onMouseEnter={() => {
                  setImgHover(true);
                }}
                onMouseLeave={() => {
                  setImgHover(false);
                }}
                onClick={() => setImgClick(true)}
              />
            )}
            {ImgClick && (
              <div
                className="absolute self-center top-30 right-0 bg-slate-700 flex flex-col gap-1 px-4 py-2 rounded-xl z-10"
                ref={imgClickRef}
              >
                <button
                  className="hover:border px-2 py-1 cursor-pointer rounded z-10"
                  onClick={() => {
                    setImgClick(false);
                    setFullImg(true);
                  }}
                >
                  View
                </button>
                {admin && (
                  <label onChange={handleImgInput}>
                    <input type="file" accept="image" className="hidden" />
                    <div className="hover:border px-2 py-1 cursor-pointer rounded z-10">
                      Change
                    </div>
                  </label>
                )}
                {admin && (
                  <button
                    className="hover:border px-2 py-1 cursor-pointer rounded z-10"
                    onClick={handleDeleteGroupImg}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="">
            {/* room name ----------------------------- */}

            <div className="relative w-[100%] flex items-center ">
              <input
                type="text"
                placeholder="Enter group description"
                className={`${
                  name && " border-b-2 border-green-600"
                } text-white w-full py-0 text-2xl font-bold rounded-md outline-0 text-center`}
                defaultValue={group?.roomName}
                disabled={!name}
                onChange={(e) => {
                  setNameInput(e.target.value);
                }}
              />
              {admin && (
                <img
                  src={!name && EditImg}
                  className="w-8 p-1 rounded cursor-pointer active:scale-85 absolute -right-8 hover:bg-[#ffffff20]"
                  onClick={() => {
                    setName(!name);
                  }}
                />
              )}
              {name && (
                <button
                  className="absolute -right-8 w-8 h-8 rounded cursor-pointer active:scale-85  text-green-600 font-extrabold text-2xl hover:bg-[#ffffff20]"
                  onClick={handleSaveName}
                >
                  &#x2713;
                </button>
              )}
            </div>
            <p className="text-gray-300 py-1 w-full rounded-md outline-0 break-words">
              Created by <span className="font-bold">{group?.createdBy}</span>{" "}
              at <span className="font-bold">{createdAt}</span>
            </p>
            {/* Description------------------------------ */}
            <div>
              <h3 className="font-bold">Description</h3>

              <div className=" relative w-[100%] flex items-center">
                <input
                  type="text"
                  placeholder="Enter group description"
                  className={`${
                    description && "border-b-2 border-green-600"
                  } text-white px-2 w-full pb-1 text-xl rounded-md outline-0 `}
                  defaultValue={group?.description}
                  disabled={!description}
                  onChange={(e) => {
                    setDescriptionInput(e.target.value);
                  }}
                />
                {description && (
                  <button
                    className="absolute -right-8 w-8 h-8 rounded cursor-pointer active:scale-85  text-green-600 font-extrabold text-2xl hover:bg-[#ffffff20]"
                    onClick={handleSaveDescription}
                  >
                    &#x2713;
                  </button>
                )}
                {admin && (
                  <img
                    src={!description && EditImg}
                    className="w-8 p-1 rounded cursor-pointer active:scale-85 absolute -right-8 hover:bg-[#ffffff20]"
                    onClick={() => {
                      setDescription(!description);
                    }}
                  />
                )}
              </div>
            </div>

            {/* room Key */}
            {admin && (
              <div>
                <h3 className="font-bold">Room Key</h3>
                <p className="text-white pl-3 w-full pb-4 text-xl rounded-md outline-0 pr-10">
                  {group?.roomKey}
                </p>
              </div>
            )}

            {/* Danger button  */}
            <div className="flex gap-5 justify-center">
              <button
                className="px-2 py-1 bg-red-400 rounded hover:bg-red-600 active:scale-90"
                onClick={() => {
                  dispatch(leaveGroup(group.roomKey)).then(() =>
                    props.setGroupNo(null)
                  );
                }}
              >
                Leave Group
              </button>

              {group?.admin?.find((admin) => admin == props.id) && (
                <button
                  className="px-2 py-1 bg-red-400 rounded hover:bg-red-600 active:scale-90"
                  onClick={() => {
                    dispatch(deleteGroup(group?.roomKey)).then(() =>
                      props.setGroupNo(null)
                    );
                  }}
                >
                  Delete Group
                </button>
              )}
            </div>
          </div>
          {/* )} */}
        </div>
      ) : (
        // {/* Memebers section */}
        <div className="w-[100%] flex flex-col gap-5">
          <h3 className="text-2xl">Members ({group?.member.length})</h3>
          <div className="flex flex-col">
            {group.member.map((value, index) => (
              <div
                key={index}
                className="flex rounded gap-2 items-center border-b border-gray-500 py-1 px-2 relative"
              >
                <img
                  src={friends[value]?.userImageUrl || DefaultUserImg}
                  className="w-9 h-9 m-1 object-cover rounded-full bg-[#ffffff1d] "
                />
                <div>
                  <p className="text-xl">{friends[value]?.name}</p>
                  <p className="text-gray-400 text-sm">
                    {friends[value]?.about}
                  </p>
                </div>
                {group.admin.find((id) => id === value) && (
                  <div className="absolute right-4 text-sm top-2 text-green-500">
                    Admin
                  </div>
                )}
                {value !== props.user.id &&
                  group.admin.find((id) => id === props.user.id) && (
                    <div
                      className="absolute right-0 font-bold cursor-pointer text-2xl"
                      onClick={() => setActiveMemberIndex(index)}
                    >
                      &#8285;
                    </div>
                  )}

                {activeMemberIndex === index && (
                  <div
                    ref={activeMemberRef}
                    className="absolute top-0 -right-0 flex flex-col bg-[#02061850] backdrop-blur-xl px-4 py-2 rounded-2xl gap-2.5 z-20"
                  >
                    {!group.admin.includes(value) && (
                      <button
                        className="hover:border px-2 py-1 rounded-xl active:scale-90"
                        onClick={()=>{const body={userId:value,roomKey:props.groupNo};dispatch(makeAdmin(body))}}
                      >
                        Make admin
                      </button>
                    )}
                    {group.admin.find((id) => id === value) && (
                      <button
                        className="hover:border px-2 py-1 rounded-xl active:scale-90"
                        onClick={()=>{const body={userId:value,roomKey:props.groupNo};dispatch(removeAdmin(body))}}
                      >
                        Remove admin
                      </button>
                    )}
                    <button
                      className="hover:border px-2 py-1 rounded-xl active:scale-90"
                      onClick={()=>{const body={userId:value,roomKey:props.groupNo};
                      dispatch(removeMember(body))
                    }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default groupInfo;
