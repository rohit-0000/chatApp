import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { findUser, sendEmail } from "../Reducer/chatSlice";
import toast from "react-hot-toast";
import Otp_verify from "./otp_verify"

const forgot_pass = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [userFound,setUserFound]=useState(false);
  const [optVerify,setOtpVerify] = useState(false);
  const [otpState, setOtpState] = useState(null);
  async function handleforgotpass(formdata) {
    const result = await dispatch(findUser(formdata));
    if (findUser.fulfilled.match(result)) {
      const generatedOtp =  Math.floor(100000 + Math.random() * 900000).toString();
      const data=result.payload;
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
      await dispatch(sendEmail(emailData));
      setOtpState({ data, generatedOtp })
      setOtpVerify(true);
    }else{
      toast.error( "User Not Found");
      setUserFound(true);
    }
  }

  return (
    optVerify? <Otp_verify state={otpState}/>:
    <form
      onSubmit={handleSubmit(handleforgotpass)}
      className="flex flex-col gap-6  px-5 md:px-15 py-10 rounded inset-shadow-sm  inset-shadow-indigo-400 shadow-sm shadow-indigo-400 w-80 md:w-2xl"
    >
      <h1 className=" text-4xl md:text-5xl font-bold">Forgot Password</h1>
      <p className="text-justify md:text-xl">
        Please enter the email adress or username you'd like your password reset
        information send to
      </p>
      <div className=" flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter username / email id"
          className="border-b text-white pl-3 text-2sm w-[275px] py-2 md:text-2xl md:w-[550px] rounded-md outline-0"
          {...register("userName", {
            required: "Enter username",
            minLength: { value: 4, message: "Min length atleast 4" },
          })}
        />
        {errors.userName && (
          <p className="text-red-500 italic self-start pl-3">
            {errors.userName.message}
          </p>
        )}
        {(!errors.userName&&userFound) && (
          <p className="text-red-500 italic self-start pl-3">
            User not found
          </p>
        )}
      </div>

      <input
        type="submit"
        value={isSubmitting ? "Requesting OTP" : "Request OTP"}
        className={
          isSubmitting
            ? "bg-green-900 text-2xl py-2 rounded-xl"
            : "bg-green-600 text-2xl py-2 rounded-xl cursor-pointer active:scale-95 transition-transform duration-150"
        }
        disabled={isSubmitting}
      />
    </form>
  );
};

export default forgot_pass;
