'use client';

const ReadyForm = ({ username, playerA, playerB }) =>  {

  const handleRequest = async () => {

    let position = '';
    if (username === playerA) {
      position = "AReady"
    } else if (username === playerB) {
      position = "BReady"
    }

    try {
      const response = await fetch(`/api/room?ready=${position}`, {
        method: 'POST',
      });
      
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <form action={handleRequest} className='EnterForm flex flex-col items-center justify-center bg-white rounded-2xl w-[50vh] h-[25vh] text-[1.5rem]'>
        <div className="w-[80%] mb-[0.5rem] flex flex-row">
          <p className="text-[#39b8ff] font-black mr-[0.5rem]">P1</p><p className="text-black">{playerA}</p>
        </div>
        <div className="w-[80%] flex flex-row">
          <p className="text-[#39b8ff] font-black mr-[0.5rem]">P2</p><p className="text-black mb-[1.6rem]">{playerB}</p>
        </div>
        <button type="submit" className='flex justify-center w-[40%] h-[20%] rounded-4xl text-white text-center font-[700] bg-[#39b8ff] cursor-pointer'>Ready</button>
    </form>
  );
};

export default ReadyForm;