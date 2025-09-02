'use client';

import React, { useState, useEffect } from 'react';

export default function FullScreenButton() {
  const [imageSrc, setImageSrc] = useState('/expand.svg');

  const toggleFullscreen = function() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(function() {
    const handleFullscreenChange = function() {
      if (document.fullscreenElement) {
        setImageSrc('/compress.svg');
      } else {
        setImageSrc('/expand.svg');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return function() {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <button onClick={toggleFullscreen} className='absolute bottom-[1rem] right-[1rem]'>
      <img src={imageSrc} id="toggleFullscreenImage" className="w-10 h-10"></img>
    </button>
  );
};
