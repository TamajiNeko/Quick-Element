'use client';

import { redirect } from 'next/navigation';

const RoomCodeForm = ({ setRoomID }) =>  {

  const handleCreateRoom = async () => {
    let response;
    
    try {
      response = await fetch('/api/room?create=true', {
        method: 'POST',
      });
      
    } catch (error) {
      console.error(error);
      return;
    }

    if (response.ok) {
      redirect('/lobby/lounge/seat');
    }
  };

  const handleRequest = async (formData) => {
    const response = await setRoomID(formData);

    try {
      response = await fetch('/api/room?join=true', {
        method: 'POST',
      });
      
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <form action={handleRequest} className='EnterForm flex flex-col items-center justify-center bg-white rounded-2xl w-[50vh] h-[25vh] text-[1.5rem]'>
      <input type="text" pattern="[a-zA-Z0-9]+" minLength={6} maxLength={6} name="roomCode" placeholder="Room Code" className='focus:outline-sky-400 border-[1px] border-[#39b8ff] border-solid w-[80%] h-[22%] rounded-4xl font-black text-center text-black placeholder-slate-400 bg-[white]' required />
      <br></br>
      <div className="flex w-[80%] h-[20%] justify-center gap-[1rem]">
        <a onClick={handleCreateRoom} className='flex justify-center w-[50%] rounded-4xl text-white text-center font-[700] bg-[#39b8ff] cursor-pointer'>Create</a>
        <button type="submit" className='flex justify-center w-[50%] rounded-4xl text-white text-center font-[700] bg-[#39b8ff] cursor-pointer'>Join</button>
      </div>
    </form>
  );
};

export default RoomCodeForm;