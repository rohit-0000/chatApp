import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import OpenEye from "../assets/open-eye.svg";
import ClosedEye from "../assets/closed-eye.svg";
import { useDispatch } from "react-redux";
import { changePassword, createUser, loginUser } from "../Reducer/chatSlice";
import { Navigate, replace, useLocation, useNavigate } from "react-router";
const change_password = () => {
  const location = useLocation(); 
  const user = location.state?.user;
  const dispatch=useDispatch();
  const navigate=useNavigate();
  
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  async function handleSetPass(data){
    if(user.password===undefined){
      user["password"]=data.password;
      const result=await dispatch(createUser(user));
      if (createUser.fulfilled.match(result)) {
        await dispatch(loginUser(user));
        navigate("/");
        window.location.reload();
      } else {
        toast.error("Failed to create user. Please try again.");
      }
    }else{
      const new_user = { ...user, password: data.password };
      const result=await dispatch(changePassword(new_user));
      if (changePassword.fulfilled.match(result)) {
        navigate("/");
        window.location.reload();
      }
    }
  }
  return (
    <div className="flex flex-col gap-11 items-center px-5 md:px-15 py-10 rounded inset-shadow-sm  inset-shadow-indigo-400 shadow-sm shadow-indigo-400">
      <h1 className=" text-4xl md:text-5xl font-bold">Set Password</h1>
      <form
        className="flex flex-col gap-5 md:gap-10 "
        onSubmit={handleSubmit(handleSetPass)}
      >
        <div>
          <div className="w-[250px] md:w-[350px] lg:w-[550px] border-b rounded-md flex ">
            <input
              type="password"
              placeholder="Enter password"
              className="text-white pl-3 text-2sm py-2 md:text-xl lg:text-2xl outline-0 w-[250px] md:w-[315px] lg:w-[510px]"
              id="password-password"
              {...register("password", {
                required: "Enter password",
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,16}$/,
                  message:
                    "Password must be 8-16 characters long, with uppercase, lowercase, digits, and special characters.",
                },
              })}
            />
            <img
              src={OpenEye}
              id="password-openEye"
              className="w-[30px] md:w-[35px] lg:w-[40px] cursor-pointer"
              onClick={() => handleTogglePassword("password")}
            />
            <img
              src={ClosedEye}
              id="password-closedEye"
              className="w-[30px] md:w-[35px] lg:w-[40px] hidden cursor-pointer"
              onClick={() => handleTogglePassword("password")}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 italic w-[250px] md:w-[350px] lg:w-[550px]">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <div className="w-[250px] md:w-[350px] lg:w-[550px] border-b rounded-md flex ">
            <input
              type="password"
              placeholder="Confirm Password"
              className="text-white pl-3 text-2sm py-2 md:text-xl lg:text-2xl outline-0 w-[250px] md:w-[315px] lg:w-[510px]"
              id="confirm-password"
              {...register("confirmPassword", {
                required: "Enter Confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            <img
              src={OpenEye}
              id="confirm-openEye"
              className="w-[30px] md:w-[35px] lg:w-[40px] cursor-pointer"
              onClick={() => handleTogglePassword("confirm")}
            />
            <img
              src={ClosedEye}
              id="confirm-closedEye"
              className="w-[30px] md:w-[35px] lg:w-[40px] hidden cursor-pointer"
              onClick={() => handleTogglePassword("confirm")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 italic w-[250px] md:w-[350px] lg:w-[550px]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <input
          type="submit"
          value={isSubmitting ? "Changing" : "Set Password"}
          className={
            isSubmitting
              ? "bg-green-900 text-2xl py-2 rounded-xl"
              : "bg-green-600 text-2xl py-2 rounded-xl cursor-pointer active:scale-95 transition-transform duration-15"
          }
          disabled={isSubmitting}
        />
      </form>
      
    </div>
  );
};

export default change_password;
