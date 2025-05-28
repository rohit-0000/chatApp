import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { createRoom } from "../Reducer/chatSlice";
const createGroup = (props) => {
  const dispatch=useDispatch();
  function handleCreateRoom(data) {
    dispatch(createRoom(data));
    props.setRoomCreateForm(false);
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  return (
      <div className="h-fit w-fit bg-[#a3a3a3a4] px-3 md:px-10 py-5 backdrop-blur-sm rounded-2xl" ref={props.ref}>
        <form
          className="flex flex-col gap-5 items-center"
          onSubmit={handleSubmit(handleCreateRoom)}
        >
          <div>
            <h2 className="text-xl font-bold italic text-slate-950">
              Group name
            </h2>
            <input
              className="outline-0 bg-slate-900 px-3 py-1 rounded text-xl w-60"
              placeholder="Enter group name"
              {...register("roomName", {
                required: "Enter group name",
              })}
            />
            {errors.roomName && (
              <div className="text-red-700 italic">
                {errors.roomName.message}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold italic text-slate-950">
              Group Key
            </h2>
            <input
              className="outline-0 bg-slate-900 px-3 py-1 rounded text-xl w-60"
              placeholder="Enter unique key"
              {...register("roomKey", {
                required: "Enter unique roomKey",
              })}
            />
            {errors.roomKey && (
              <div className="text-red-700 italic">
                {errors.roomKey.message}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold italic text-slate-950">
              Description
            </h2>
            <input
              className="outline-0 bg-slate-900 px-3 py-1 rounded text-xl w-60"
              placeholder="Enter Description (Optional)"
              {...register("description")}
            />
          </div>
          <div>
            <input
              className="bg-green-700 px-3 py-1 rounded text-xl active:scale-95"
              type="submit"
              value={"Submit"}
            />
          </div>
        </form>
      </div>
  );
};

export default createGroup;
