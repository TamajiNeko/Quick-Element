'use client';

const UserNameForm = ({ setUsername }) => {

  const handleSetUsername = async (formData) => {
    const response = await setUsername(formData);
  };

  return (
    <form action={handleSetUsername} className='EnterForm flex flex-col items-center justify-center bg-white rounded-2xl w-[50vh] h-[25vh] text-[1.5rem]'>
      <input type="text" pattern="[a-zA-Z0-9]+" name="userName" minLength={4} maxLength={10} placeholder="User Name" className='focus:outline-sky-400 border-[1px] border-[#39b8ff] border-solid w-[80%] h-[22%] rounded-4xl font-black text-center text-black placeholder-slate-400 bg-[white]' required />
      <br></br>
      <button type="submit" className='flex justify-center items-center w-[40%] h-[20%] rounded-4xl text-white text-center font-[700] bg-[#39b8ff] cursor-pointer'>Enter</button>
    </form>
  );
};

export default UserNameForm;