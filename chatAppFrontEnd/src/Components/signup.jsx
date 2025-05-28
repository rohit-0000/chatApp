import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { findUser, sendEmail } from "../Reducer/chatSlice";
import toast from "react-hot-toast";
import OtpVerify from "./otp_verify";
import GoogleLoginButton from "./GoogleLoginButton";
const signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signupStart,setSignupStart] = useState(false);
   const [otpState, setOtpState] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  
  async function handleSignup(data) {
    // Check if the username or email already exists
    const resultUserName = await dispatch(findUser({ userName: data.userName }));
    const resultEmail = await dispatch(findUser({ userName: data.email })); 
    if (
      findUser.fulfilled.match(resultUserName) || findUser.fulfilled.match(resultEmail)
    ) {
      toast.error("User already exists");
      return; // Stop further execution
    }
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const emailData = {
      to: data.email,
      subject: "Email verification from EasyChat",
      body: `Dear ${data.name},

        Your EasyChat verification code is:

        ${generatedOtp}

        Please enter this code in the app/website to verify your email address.

        If you didn’t request this, please ignore this email. For assistance, contact our support team at [rohitcollege212004@gmail.com].

        Best regards,
        The EasyChat Team`,
    };
    dispatch(sendEmail(emailData))
      setSignupStart(true);
      setOtpState({data,generatedOtp});
  }
  return (
    signupStart?<OtpVerify state={otpState}/>:
    <div className="flex flex-col gap-11 items-center px-5 md:px-15 py-10 rounded inset-shadow-sm  inset-shadow-indigo-400 shadow-sm shadow-indigo-400">
      <h1 className=" text-4xl md:text-5xl font-bold">Signup</h1>
      <form
        className="flex flex-col gap-5 md:gap-10 "
        onSubmit={handleSubmit(handleSignup)}
      >
        <div>
          <input
            type="text"
            placeholder="Enter name"
            className="border-b text-white pl-3 text-2sm w-[250px] py-2 md:text-xl md:w-[350px] lg:text-2xl lg:w-[550px] rounded-md outline-0"
            {...register("name", {
              required: "Enter name",
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
          {errors.name && (
            <p className="text-red-500 italic">{errors.name.message}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            placeholder="Enter email id"
            className="border-b text-white pl-3 text-2sm w-[250px] py-2 md:text-xl md:w-[350px] lg:text-2xl lg:w-[550px] rounded-md outline-0"
            {...register("email", {
              required: "Enter email id",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email id",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 italic">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter username"
            className="border-b text-white pl-3 text-2sm w-[250px] py-2 md:text-xl md:w-[350px] lg:text-2xl lg:w-[550px] rounded-md outline-0"
            {...register("userName", {
              required: "Enter username",
              minLength: { value: 4, message: "Min length atleast 4" },
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "Only letters and numbers allowed",
              },
            })}
          />
          {errors.userName && (
            <p className="text-red-500 italic ">{errors.userName.message}</p>
          )}
        </div>

        <input
          type="submit"
          value={isSubmitting ? "Creating account" : "Signup"}
          className={
            isSubmitting
              ? "bg-green-900 text-2xl py-2 rounded-xl"
              : "bg-green-600 text-2xl py-2 rounded-xl cursor-pointer active:scale-95 transition-transform duration-15"
          }
          disabled={isSubmitting}
        />
      </form>
      <GoogleLoginButton/>
      <p>
        Already have an account?{" "}
        <Link to="/" className="text-blue-300 underline">
          Signin
        </Link>
      </p>
    </div>
  );
};

export default signup;
