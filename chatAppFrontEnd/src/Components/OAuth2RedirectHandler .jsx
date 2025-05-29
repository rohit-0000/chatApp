import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("chatAppToken", token);
      navigate("/home");
      window.location.reload();
    } else {
      navigate("/"); 
      window.location.reload();
    }
  }, []);

  return null;
};

export default OAuth2RedirectHandler;