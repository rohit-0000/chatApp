import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { joinRoom } from '../Reducer/chatSlice';

const joinGroup = (props) => {
    const dispatch=useDispatch();

    function handleJoinRoom(data) {
      dispatch(joinRoom(data.roomKey))
      props.setRoomJoinForm(false);
    }
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm();
    return (
        <div className="h-fit max-w-full bg-[#a3a3a3a4] px-3 md:px-10 py-5 backdrop-blur-sm rounded-2xl" ref={props.ref}>
          <form
            className="flex flex-col gap-5 items-center"
            onSubmit={handleSubmit(handleJoinRoom)}
          >
            
            <div>
              <h2 className="text-xl font-bold italic text-slate-950">
                Group Key
              </h2>
              <input
                className="outline-0 bg-slate-900 px-3 py-1 rounded text-xl w-60"
                placeholder="Enter room key"
                {...register("roomKey", {
                  required: "Enter roomKey",
                })}
              />
              {errors.roomKey && (
                <div className="text-red-700 italic">
                  {errors.roomKey.message}
                </div>
              )}
            </div>
            <div>
              <input
                className="bg-green-700 px-3 py-1 rounded text-xl active:scale-95"
                type="submit"
                value={"Join"}
              />
            </div>
          </form>
        </div>
    );
}

export default joinGroup