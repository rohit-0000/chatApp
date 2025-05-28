import React, { useState } from "react";
import OpenEye from "../assets/open-eye.svg";
import ClosedEye from "../assets/closed-eye.svg";
import { Link, Navigate, replace, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { findUser, getUserDetail, loginUser } from "../Reducer/chatSlice";
import { NavLink } from "react-router";
import GoogleLoginButton from "./GoogleLoginButton";
const login = () => {
  const dispatch = useDispatch();
  const[forgotPass,setForgotPass] = useState(false);
  const navigate = useNavigate();
  function handleTogglePassword() {
    let pass = document.getElementById("password");
    let open = document.getElementById("openEye");
    let close = document.getElementById("closedEye");

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function handleLogin(data) {
    const result =await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate("/home");
      window.location.reload();
    }else{
      setForgotPass(true);
    }
  }

  return (
    <div className="flex flex-col gap-11 items-center px-5 md:px-15 py-10 rounded inset-shadow-sm  inset-shadow-indigo-400 shadow-sm shadow-indigo-400">
      <h1 className=" text-4xl md:text-5xl font-bold">Login</h1>
      <form
        className="flex flex-col gap-5 md:gap-10 "
        onSubmit={handleSubmit(handleLogin)}
      >
        <div>
          <input
            type="text"
            placeholder="Enter username / email id"
            className="border-b text-white pl-3 text-2sm w-[250px] py-2 md:text-xl md:w-[350px] lg:text-2xl lg:w-[550px] rounded-md outline-0"
            {...register("userName", {
              required: "Enter username",
              minLength: { value: 4, message: "Min length atleast 4" },
            })}
          />
          {errors.username && (
            <p className="text-red-500 italic">{errors.username.message}</p>
          )}
        </div>
        <div>
          <div className="w-[250px] md:w-[350px] lg:w-[550px] border-b rounded-md flex ">
            <input
              type="password"
              placeholder="Enter password"
              className=" text-white pl-3 text-2sm  py-2 md:text-xl lg:text-2xl  outline-0 w-[250px] md:w-[315px] lg:w-[510px]"
              id="password"
              {...register("password", {
                required: "Enter password",
                pattern: {
                  value: /^.{8,}$/,
                  message:
                    "Password must be 8-16 characters long, with uppercase, lowercase, digits, and special characters.",
                },
              })}
            />
            <img
              src={OpenEye}
              id="openEye"
              className="w-[30px] md:w-[35px] lg:w-[40px] cursor-pointer"
              onClick={handleTogglePassword}
            />
            <img
              src={ClosedEye}
              id="closedEye"
              className="w-[30px] md:w-[35px] lg:w-[40px] hidden cursor-pointer"
              onClick={handleTogglePassword}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 italic w-[250px] md:w-[350px] lg:w-[550px]">
              {errors.password.message}
            </p>
          )}
          {
            forgotPass &&(
              <p className="text-red-500 italic w-[250px] md:w-[350px] lg:w-[550px]">
              Incorrect UserName or Password
            </p>
            )
          }
          {(errors.password ||forgotPass) && (
            <NavLink to="/forgot-password" className="text-blue-300 pt-1.5 ">
              Forgot password ?
            </NavLink>
          )}
        </div>

        <input
          type="submit"
          value={isSubmitting ? "Logging in" : "Login"}
          className={
            isSubmitting
              ? "bg-green-900 text-2xl py-2 rounded-xl"
              : "bg-green-600 text-2xl py-2 rounded-xl cursor-pointer active:scale-95 transition-transform duration-150"
          }
          disabled={isSubmitting}
        />
      </form>
      <GoogleLoginButton/>
      <p>
        Don't have an account ?{" "}
        <Link to="/signup" className="text-blue-300 underline">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default login;
