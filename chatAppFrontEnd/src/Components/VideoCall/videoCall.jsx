import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endCall, setCallStatus } from "../../Reducer/callSlice";

const videoCall = () => {
  const localVideoRef = useRef();
  const dispatch = useDispatch();
  const call = useSelector((state) => state.call);

  function handleEndCall() {
    dispatch(setCallStatus("ended"));
    dispatch(endCall(call.activeRoomId));
  }

  return (
    <div className="w-40  flex flex-col rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl">
      <video ref={localVideoRef} autoPlay muted className="w-full h-full" />

      <button className="self-center bg-red-600 w-full active:scale-90" onClick={handleEndCall}>End Call</button>
    </div>
  );
};

export default videoCall;
