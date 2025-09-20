'use client';
import { useState } from 'react';

const ReadyForm = ({ username, playerA, playerB, readyStatsA, readyStatsB }) => {
  const [isReadyButtonDisabled, setIsReadyButtonDisabled] = useState(false);
  const [position, setPosition] = useState('');

  const readyStatusImages = {
    0: '/not_ready.png',
    1: '/ready.png',
    2: '/wait.png',
  };

  const playerAImageSrc = readyStatusImages[readyStatsA];
  const playerBImageSrc = readyStatusImages[readyStatsB];

  if (username === playerA && readyStatsA !== 1) {
    if (position !== 'AReady') {
      setPosition('AReady');
      setIsReadyButtonDisabled(false);
    }
  } else if (username === playerB && readyStatsB !== 1) {
    if (position !== 'BReady') {
      setPosition('BReady');
      setIsReadyButtonDisabled(false);
    }
  } else {
    if (!isReadyButtonDisabled) {
      setIsReadyButtonDisabled(true);
    }
  }
  
  const handleRequest = async (e) => {
    e.preventDefault();
    
    setIsReadyButtonDisabled(true); 

    try {
      const response = await fetch(`/api/room?ready=${position}`, {
        method: 'POST',
      });
      
    } catch (error) {
      console.error(error);
      setIsReadyButtonDisabled(false);
    }
  };

  const playerBClass = `${playerB === "Waiting..." ? 'text-gray-400' : 'text-black'}`;
  const buttonClass = `
    flex justify-center w-[40%] h-[20%] rounded-4xl text-white text-center font-[700] 
    ${isReadyButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#39b8ff] cursor-pointer'}
  `;

  return (
    <form onSubmit={handleRequest} className='EnterForm flex flex-col items-center justify-center bg-white rounded-2xl w-[50vh] h-[25vh] text-[1.5rem]'>
      <div className="w-[80%] pb-[.5rem] items-center flex flex-row">
        <img src={playerAImageSrc} className="w-6 h-6 mr-[.75rem]"></img><p className="text-black">{playerA} (Owner)</p>
      </div>
      <div className="w-[80%] pb-[1.6rem] items-center flex flex-row">
        <img src={playerBImageSrc} className="w-6 h-6 mr-[.75rem]"></img><p className={playerBClass}>{playerB}</p>
      </div>
      <button type="submit" id="readyButton" className={buttonClass} disabled={isReadyButtonDisabled}>
        Ready
      </button>
    </form>
  );
};

export default ReadyForm;