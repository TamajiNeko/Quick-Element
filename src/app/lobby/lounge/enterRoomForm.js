'use client';

import Link from "next/link";

const RoomCodeForm = ({ roomCode }) => {

  const handleSetroomCode = async (formData) => {
    const response = await setRoomCode(formData);
  };

  return (
    <form className='EnterForm flex flex-col items-center justify-center bg-white rounded-2xl w-[50vh] h-[25vh] text-[1.5rem]'>
        <input type="text" maxLength={6} name="roomCode" placeholder="Room Code" className='focus:outline-sky-400 border-[1px] border-[#39b8ff] border-solid w-[80%] h-[22%] rounded-4xl font-black text-center text-black placeholder-slate-400 bg-[white]' required />
        <br></br>
        <div className="flex w-[80%] h-[20%] justify-center gap-[1rem]">
            <Link href={"/lobby/lounge/seat"} className='w-[50%] rounded-4xl text-white text-center font-[700] bg-[#39b8ff] cursor-pointer'>Create</Link>
            <button type="submit" className='w-[50%] rounded-4xl text-white text-center font-[700] bg-[#39b8ff] cursor-pointer'>Join</button>
        </div>
    </form>
  );
};

export default RoomCodeForm;