'use client';

import React from 'react';
import { deleteUsername } from '../lib/DeleteUserName';

export default function UserNamePlateWithEdit({ username }) {
  const handleDeleteUsername = () => {
    deleteUsername();
  };

  return (
    <div 
      className="flex flex-row gap-[.5rem] items-center absolute right-[1rem] top-[.75rem] cursor-pointer" 
      onClick={handleDeleteUsername}
    >
      <p className="text-[2rem]">{username || 'N/A'}</p>
      <img src="/pen.svg" draggable="false" className="w-[2rem] h-[2rem]" alt="Edit or Delete Username"></img>
    </div>
  );
}