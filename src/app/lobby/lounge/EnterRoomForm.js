'use client';

// ❌ ลบการ import redirect ออก เนื่องจากทำให้เกิด error
// import { redirect } from 'next/navigation'; 
import { useState } from 'react';

const RoomCodeForm = ({ setRoomID }) =>  {
  
  const [isLoading, setLoading] = useState(false);

  // --- handleCreateRoom: ใช้งาน let ถูกต้องแล้ว ---
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
      // ✅ แก้ไข: ใช้วิธีนำทางที่เข้ากันได้กับ Client Component (window.location)
      window.location.href = '/lobby/lounge/seat'; 
    }
  };

  // --- handleRequest: แก้ไขให้ใช้ let สำหรับ response และการนำทาง ---
  const handleRequest = async (formData) => {
    // 1. ประกาศด้วย let เพื่อให้กำหนดค่าใหม่ได้
    let response; 
    
    // 2. เรียกใช้ setRoomID และกำหนดค่าให้ response ครั้งแรก
    //    *สมมติว่า setRoomID(formData) ส่งคืนค่าบางอย่างที่จำเป็น หรือเป็น Response object*
    response = await setRoomID(formData); 
    
    setLoading(true);
    try {
      // 3. กำหนดค่าใหม่ให้กับ response (fetch call)
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
      // ✅ เพิ่มการนำทางเมื่อ Join สำเร็จ
      window.location.href = '/lobby/lounge/seat';
    }
  };

  const buttonClasses = `flex justify-center w-[50%] rounded-4xl text-white text-center font-[700] transition-colors duration-200`;

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
