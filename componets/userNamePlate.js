'use client';

import React from 'react';
import { deleteUsername } from '../lib/deleteUserName';

export default function UserNamePlate({ username }) {
  const handleDeleteUsername = () => {
    deleteUsername();
  };
  

  return (
    <div 
      className="flex flex-row gap-[.5rem] items-center absolute right-[1rem] top-[.75rem] cursor-pointer" 
      onClick={handleDeleteUsername}
    >
      <p className="text-[1.25rem]">{username || 'N/A'}</p>
      <img src="/pen.svg" className="w-[1.5rem] h-[1.5rem]" alt="Edit or Delete Username"></img>
    </div>
  );
}