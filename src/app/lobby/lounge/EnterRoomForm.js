'use client';

import { useState } from 'react';

const RoomCodeForm = ({ setRoomID }) =>  {
  
  const [isLoading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    let response;
    setLoading(true);
    try {
      response = await fetch('/api/room?create=true', {
        method: 'POST',
      });
      
    } catch (error) {
      console.error(error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }

    if (response && response.ok) {
      window.location.href = '/lobby/lounge/seat'; 
    }
  };

  const handleRequest = async (formData) => {
    let response; 
    
    response = await setRoomID(formData); 
    
    setLoading(true);
    try {
      response = await fetch('/api/room?join=true', {
        method: 'POST',
      });
      
    } catch (error) {
      console.error(error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }

    if (response && response.ok) {
      window.location.href = '/lobby/lounge/seat';
    }
  };

  const buttonClasses = `flex justify-center w-[50%] rounded-4xl items-center text-white text-center font-[700]`;

  const disabledButtonClasses = `bg-gray-400 cursor-not-allowed`;

  const enabledButtonClasses = `bg-[#39b8ff] cursor-pointer hover:bg-sky-500`;

  return (
    <form action={handleRequest} className='EnterForm flex flex-col items-center justify-center bg-white rounded-2xl w-[50vh] h-[25vh] text-[1.5rem]'>
      <input type="text" pattern="[a-zA-Z0-9]+" minLength={6} maxLength={6} name="roomCode" placeholder="Room Code"
      className='focus:outline-sky-400 border-[1px] border-[#39b8ff] border-solid w-[80%] h-[22%] rounded-4xl font-black text-center text-black placeholder-slate-400 bg-[white]' 
      required disabled={isLoading}/>
      <br></br>
      <div className="flex w-[80%] h-[20%] justify-center gap-[1rem]">
        <a onClick={isLoading ? (e) => e.preventDefault() : handleCreateRoom} 
          className={`${buttonClasses} ${isLoading ? disabledButtonClasses : enabledButtonClasses}`}>
          Create
        </a>
        <button type="submit" className={`${buttonClasses} ${isLoading ? disabledButtonClasses : enabledButtonClasses}`}
        disabled={isLoading}>
          Join
        </button>
      </div>
    </form>
  );
};

export default RoomCodeForm;
