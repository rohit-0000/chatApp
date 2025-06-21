import React, { useEffect, useRef, useState } from "react";
import UserImg from "../assets/DefaultUser.svg";
import EditImg from "../assets/editImg.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import EditTextImg from "../assets/editTextImg.svg";
import OpenEye from "../assets/open-eye.svg";
import ClosedEye from "../assets/closed-eye.svg";
import toast from "react-hot-toast";
import {
  deleteProfileImg,
  setProfileImg,
  updateUser,
} from "../Reducer/chatSlice";
import bcrypt from "bcryptjs";
const profile = () => {
  const user = useSelector((state) => state.chatApp.user);
  const [isImgHover, setIsImgHover] = useState(false);
  const [clickOption, setClickOption] = useState(false);
  const [fullImg, setFullImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);
  const imgRef = useRef(null);
  const imgInputRef = useRef(null);


  const dispatch = useDispatch();

  const [userName, setUsername] = useState(false);
  const [name, setName] = useState(false);
  const [about, setAbout] = useState(false);
  const [email, setEmail] = useState(false);
  const {
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors: errorsForm1, isSubmitting: isSubmittingForm1 },
  } = useForm();
  const {
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    watch: watchForm2,
    formState: { errors: errorsForm2, isSubmitting: isSubmittingForm2 },
  } = useForm();
  const {
    register: registerForm3,
    handleSubmit: handleSubmitForm3,
    watch: watchForm3,
    reset,
    formState: { errors: errorsForm3, isSubmitting: isSubmittingForm3 },
  } = useForm();

  function handleImgClick(e) {
    e.preventDefault();
    setClickOption(true);
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (btnRef.current && !btnRef.current.contains(event.target)) {
        setClickOption(false);
      }
      if (imgRef.current && !imgRef.current.contains(event.target)) {
        setFullImg(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function handleViewClick(e) {
    e.preventDefault();
    setFullImg(true);
    setClickOption(false);
    setIsImgHover(false);
  }
  function handleTogglePassword(field) {
    const pass = document.getElementById(`${field}-password`);
    const open = document.getElementById(`${field}-openEye`);
    const close = document.getElementById(`${field}-closedEye`);

    if (pass.type === "password") {
      pass.type = "text";
      open.style.display = "none";
      close.style.display = "block";
    } else {
      pass.type = "password";
      open.style.display = "block";
      close.style.display = "none";
    }
  }
  function handleEditImg(e) {
    e.preventDefault();
    imgInputRef.current.click();
  }
  function handleImgInput(e) {
    const img = e.target.files[0];
    if (img && img.type.startsWith("image/")) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", img);
      dispatch(setProfileImg(formData)).then(()=>setLoading(false));
    } else {
      toast.error("Invalid file type");
    }
  }
  function handleImgRemove() {
    dispatch(deleteProfileImg());
  }
  function saveName(data) {
    dispatch(updateUser(data));
  }
  function handlePasswordChange(data) {
    bcrypt.compare(data.CurrentPassword, user.password, (err, result) => {
      if (err) {
        toast.error("Error comparing Password");
        console.log(err);
      } else if (result) {
        dispatch(updateUser(data)).then(()=>{
          toast.success("Password updated successfully");
          reset();
        })
      } else {
        toast.error("Password do not match");
      }
    });
  }

  function updateUSerName(data) {
    dispatch(updateUser(data));
  }
  return (
    <div className="  w-screen p-2 pl-16 h-screen">
      <div className="bg-[#ffffff11] w-full  rounded-xl flex flex-col justify-center items-center md:px-20 py-10 gap-10 min-h-full">
        <label
          className={`cursor-pointer  relative`}
          onMouseEnter={() => {
            !fullImg && setIsImgHover(true);
          }}
          onMouseLeave={() => {
            !fullImg && setIsImgHover(false);
          }}
        >
          <img
            className={` ${
              fullImg
                ? "w-[85vw] h-[85vw] md:w-[55vw] md:h-[55vw]"
                : "w-[60vw] h-[60vw] md:w-90 md:h-90"
            }  rounded-xl object-cover transition-all duration-500 ease-linear`}
            src={user.userImageUrl || UserImg}
            ref={imgRef}
            onClick={(e) => {
              e.preventDefault();
            }}
          />
          {loading && (
            <div className="absolute top-0 left-0 w-[60vw] h-[60vw] md:w-90 md:h-90 p-[40%] md:p-35 rounded-xl self-center cursor-pointer bg-[#00000075]">
              <div className="w-16 h-16 border-5 border-transparent animate-spin  border-t-blue-400 rounded-full flex justify-center items-center">
                <div
                  className="w-10 h-10 border-5 border-transparent animate-spin  border-t-red-400 rounded-full"
                  div
                />
              </div>
            </div>
          )}
            <img
              src={EditImg}
              className={`absolute top-0 left-0 w-[60vw] h-[60vw] md:w-90 md:h-90 p-[40%] md:p-35 bg-[#000000a7] rounded-xl ${isImgHover?"opacity-100":"opacity-0"}`}
              onClick={handleImgClick}
            />
          <input
            type={"file"}
            accept="image/*"
            className="hidden"
            ref={imgInputRef}
            onChange={handleImgInput}
          />

          {clickOption && (
            <div
              className="absolute right-0 bottom-[0px] flex flex-col bg-neutral-900 w-30 px-3 py-3 gap-2 rounded-xl text-2xl z-10"
              ref={btnRef}
            >
              <button
                className="hover:border w-full rounded-md py-1"
                onClick={handleEditImg}
              >
                Change
              </button>
              {user.userImageUrl && (
                <button
                  className="hover:border w-full rounded-md py-1"
                  onClick={handleImgRemove}
                >
                  Remove
                </button>
              )}
              <button
                className="hover:border w-full rounded-md py-1"
                onClick={handleViewClick}
              >
                View
              </button>
            </div>
          )}
        </label>
        {!fullImg && (
          <div>
            <form
              className="flex flex-col gap-5 md:gap-10 w-[70vw]"
              onSubmit={handleSubmitForm1(saveName)}
            >
              <div className="flex items-center flex-col md:flex-row w-full justify-between">
                <h2 className="font-bold text-xl">Name</h2>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter name"
                      className={`${
                        name ? "border" : "border-b"
                      } text-white pl-3 text-2sm w-[250px] py-2 md:text-xl md:w-[350px] lg:text-2xl lg:w-[550px] rounded-md outline-0 pr-10 relative`}
                      disabled={!name}
                      defaultValue={user.name}
                      {...registerForm1("name", {
                        minLength: {
                          value: 4,
                          message: "Length must be 4-12 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\s]{3,12}$/,
                          message: "Name must be 3-12 letters long",
                        },
                      })}
                    />
                    <img
                      src={EditTextImg}
                      className="absolute right-0 top-1 w-9 cursor-pointer active:scale-85"
                      onClick={() => {
                        setName(!name);
                      }}
                    />
                  </div>
                  {errorsForm1.name && (
                    <p className="text-red-500 italic absolute pl-2">
                      {errorsForm1.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center flex-col md:flex-row w-full justify-between">
                <h2 className="font-bold text-xl ">About</h2>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter about yourself"
                      className={`${
                        about ? "border" : "border-b"
                      } text-white pl-3 text-2sm w-[250px] py-2 md:text-xl md:w-[350px] lg:text-2xl lg:w-[550px] rounded-md outline-0 pr-10`}
                      defaultValue={user.about}
                      disabled={!about}
                      {...registerForm1("about")}
                    />
                    <img
                      src={EditTextImg}
                      className="absolute right-0 top-1 w-9 cursor-pointer active:scale-85"
                      onClick={() => {
                        setAbout(!about);
                      }}
                    />
                  </div>
                  {errorsForm1.about && (
                    <p className="text-red-500 italic absolute pl-2">
                      {errorsForm1.about.message}
                    </p>
                  )}
                </div>
              </div>

              <input
                type="submit"
                value={isSubmittingForm1 ? "Creating account" : "Save"}
                className={
                  isSubmittingForm1
                    ? "bg-green-900 text-2xl py-2 rounded-xl"
                    : "bg-green-600 text-2xl py-2 rounded-xl cursor-pointer active:scale-95 transition-transform duration-15"
                }
                disabled={isSubmittingForm1}
              />
            </form>

            {/* --------------------------------------------------------------------------------------- */}
            <div className="w-full border-2 my-8"></div>
            <form
              className="flex flex-col gap-5 md:gap-10 w-[70vw]"
              onSubmit={handleSubmitForm2(updateUSerName)}
            >
              <div className="flex items-center flex-col md:flex-row w-full justify-between">
                <h2 className="font-bold text-xl"> Username</h2>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter username"
                      className={`${
                        userName ? "border" : "border-b"
                      } text-white pl-3 text-2sm w-[250px] py-2 md:text-xl md:w-[350px] lg:text-2xl lg:w-[550px] rounded-md outline-0 pr-10`}
                      defaultValue={user.userName} // Set the initial value
                      readOnly={!userName} // Use readOnly instead of disabled
                      {...registerForm2("userName", {
                        minLength: {
                          value: 4,
                          message: "Min length at least 4",
                        },
                      })}
                    />
                    <img
                      src={EditTextImg}
                      className="absolute right-0 top-1 w-9 cursor-pointer active:scale-85"
                      onClick={() => setUsername(!userName)} // Toggle edit mode
                    />
                  </div>
                  {errorsForm2.userName && (
                    <p className="text-red-500 italic absolute pl-2">
                      {errorsForm2.userName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center flex-col md:flex-row w-full justify-between">
                <h2 className="font-bold text-xl">Email</h2>
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter email id"
                      className={`${
                        email ? "border" : "border-b"
                      } text-white pl-3 text-2sm w-[250px] py-2 md:text-xl md:w-[350px] lg:text-2xl lg:w-[550px] rounded-md outline-0 pr-10`}
                      defaultValue={user.email}
                      disabled
                    />
                   
                  </div>
                </div>
              </div>

              <input
                type="submit"
                value={isSubmittingForm2 ? "Creating account" : "Save"}
                className={
                  isSubmittingForm2
                    ? "bg-green-900 text-2xl py-2 rounded-xl"
                    : "bg-green-600 text-2xl py-2 rounded-xl cursor-pointer active:scale-95 transition-transform duration-15"
                }
                disabled={isSubmittingForm2}
              />
            </form>
            <div className="w-full border-2 my-8"></div>

            {/* /------------------------------------------------------------------------- */}
            <form
              className="flex flex-col gap-5 md:gap-10 w-[70vw]"
              onSubmit={handleSubmitForm3(handlePasswordChange)}
            >
              <div className="flex items-center flex-col md:flex-row w-full justify-between">
                <h2 className="font-bold text-xl">Current Password</h2>
                <div>
                  <div className="w-[250px] md:w-[350px] lg:w-[550px] border-b rounded-md flex">
                    <input
                      type="Password"
                      placeholder="Enter Current password"
                      className="text-white pl-3 text-2sm py-2 md:text-xl lg:text-2xl outline-0 w-[250px] md:w-[315px] lg:w-[510px]"
                      id="current-password"
                      {...registerForm3("CurrentPassword", {
                        required: "Enter Current password",
                      })}
                    />
                    <img
                      src={OpenEye}
                      id="current-openEye"
                      className="w-[30px] md:w-[35px] lg:w-[40px] cursor-pointer pr-1.5 md:pr-0"
                      onClick={() => handleTogglePassword("current")}
                    />
                    <img
                      src={ClosedEye}
                      id="current-closedEye"
                      className="w-[30px] md:w-[35px] lg:w-[40px] hidden cursor-pointer pr-1.5 md:pr-0"
                      onClick={() => handleTogglePassword("current")}
                    />
                  </div>
                  {errorsForm3.CurrentPassword && (
                    <p className="text-red-500 italic w-[250px] md:w-[350px] lg:w-[550px] absolute pl-2">
                      {errorsForm3.CurrentPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center flex-col md:flex-row w-full justify-between">
                <h2 className="font-bold text-xl">Password</h2>
                <div>
                  <div className="w-[250px] md:w-[350px] lg:w-[550px] border-b rounded-md flex">
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="text-white pl-3 text-2sm py-2 md:text-xl lg:text-2xl outline-0 w-[250px] md:w-[315px] lg:w-[510px]"
                      id="password-password"
                      {...registerForm3("password", {
                        required: "Enter password",
                        pattern: {
                          value:
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,16}$/,
                          message: "Enter Strong Password",
                        },
                      })}
                    />
                    <img
                      src={OpenEye}
                      id="password-openEye"
                      className="w-[30px] md:w-[35px] lg:w-[40px] cursor-pointer pr-1.5 md:pr-0"
                      onClick={() => handleTogglePassword("password")}
                    />
                    <img
                      src={ClosedEye}
                      id="password-closedEye"
                      className="w-[30px] md:w-[35px] lg:w-[40px] hidden cursor-pointer pr-1.5 md:pr-0"
                      onClick={() => handleTogglePassword("password")}
                    />
                  </div>
                  {errorsForm3.password && (
                    <p className="text-red-500 italic w-[250px] md:w-[350px] lg:w-[550px] absolute pl-2">
                      {errorsForm3.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center flex-col md:flex-row w-full justify-between ">
                <h2 className="font-bold text-xl">Confirm password</h2>
                <div>
                  <div className="w-[250px] md:w-[350px] lg:w-[550px] border-b rounded-md flex ">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="text-white pl-3 text-2sm py-2 md:text-xl lg:text-2xl outline-0 w-[250px] md:w-[315px] lg:w-[510px]"
                      id="confirm-password"
                      {...registerForm3("confirmPassword", {
                        required: "Enter Confirm your password",
                        validate: (value) =>
                          value === watchForm3("password") ||
                          "Passwords do not match",
                      })}
                    />
                    <img
                      src={OpenEye}
                      id="confirm-openEye"
                      className="w-[30px] md:w-[35px] lg:w-[40px] cursor-pointer pr-1.5 md:pr-0"
                      onClick={() => handleTogglePassword("confirm")}
                    />
                    <img
                      src={ClosedEye}
                      id="confirm-closedEye"
                      className="w-[30px] md:w-[35px] lg:w-[40px] hidden cursor-pointer pr-1.5 md:pr-0"
                      onClick={() => handleTogglePassword("confirm")}
                    />
                  </div>
                  {errorsForm3.confirmPassword && (
                    <p className="text-red-500 italic w-[250px] md:w-[350px] lg:w-[550px] absolute pl-2">
                      {errorsForm3.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <input
                type="submit"
                value={isSubmittingForm3 ? "Changing" : "Change Password"}
                className={
                  isSubmittingForm3
                    ? "bg-green-900 text-2xl py-2 rounded-xl"
                    : "bg-green-600 text-2xl py-2 rounded-xl cursor-pointer active:scale-95 transition-transform duration-15 mt-2"
                }
                disabled={isSubmittingForm3}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default profile;
