import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import GoogleImg from "../assets/googleImg.svg"

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const redirectUri = `${import.meta.env.VITE_BACKEND_URL}/auth/google/callback`;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const scope = "openid profile email";
    const responseType = "code";

    const authUrl = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    window.location.href = authUrl;
  };

  return (
    <div>
      <button onClick={handleLogin} className='border-2 px-5 py-2 rounded-2xl cursor-pointer active:scale-95 flex gap-3 items-center'>
        <img src={GoogleImg} className='w-10 p-1' />
        <p className='text-sm'>
        Login / Signup with google</p>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
