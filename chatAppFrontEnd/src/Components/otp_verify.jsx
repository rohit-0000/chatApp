import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { replace, useLocation, useNavigate } from "react-router";
import { sendEmail } from "../Reducer/chatSlice";
import toast from "react-hot-toast";

const OtpVerify = (props) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const recievedState = props.state ;
  const email = recievedState.data.email ||"" ;
  const [sendOTP, SetSendOTP] = useState(recievedState.generatedOtp);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((Timer) => Timer - 1); // Decrease timer by 1 every second
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [timer]);
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    // Allow only numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp]; //copy
    newOtp[index] = value;

    setOtp(newOtp);

    // Move focus to the next input if the current one is filled
    if (value && index < otp.length - 1) {
      e.target.nextSibling?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.target.previousSibling?.focus();
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue == sendOTP) {
      toast.success("Email verified");
      navigate("/change-pass", {state:{ user: recievedState.data },replace:true});
    } else {
      toast.error("Incorrect OTP");
    }
  };
  async function handleResendOTP() {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    SetSendOTP(generatedOtp);

    const emailData = {
      to: recievedState.data.email,
      subject: "Email verification from EasyChat",
      body: generatedOtp,
      name: recievedState.data.name,
    };
    setTimer(30);
    await dispatch(sendEmail(emailData));
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-6  px-5 md:px-15 py-10 rounded inset-shadow-sm  inset-shadow-indigo-400 shadow-sm shadow-indigo-400 w-80 md:w-2xl"
    >
      <h2 className="text-4xl md:text-5xl font-bold">OTP Verification</h2>
      <p className="text-center">
        We have sent an OTP to your email {email}.<br /> Please check your inbox
        and spam folder if you don't see it
      </p>
      <div className="flex gap-2 justify-center">
        {otp.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder="0"
            className="border-b-2  aspect-square w-10 md:w-20 text-center text-xl md:text-3xl font-bold text-white outline-0"
          />
        ))}
      </div>

      {timer === 0 ? (
        <div className="flex gap-2 items-center">
          <p>If you did't receive a code !</p>
          <button
            type="button"
            className="text-amber-600 text-xl cursor-pointer hover:text-amber-900 active:scale-95 transition-transform duration-150"
            onClick={handleResendOTP}
          >
            resend
          </button>
        </div>
      ) : (
        <p>Resend OTP in {timer} sec</p>
      )}

      <input
        type="submit"
        className="bg-amber-600 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-amber-900 active:scale-95 transition-transform duration-150"
        value={"Verify OTP"}
      />
    </form>
  );
};

export default OtpVerify;
