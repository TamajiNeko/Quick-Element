'use client';

import Link from "next/link";
import FullScreenButton from "../../componets/fullScreenButton";

import { useState, useEffect } from 'react';

export default function Page() {

  useEffect(() => {
    document.title = "Quik Element";
  }, []);
  
  return (
    <main>
      <Link href="/lobby" className="felx w-screen h-screen">
        <div className="flex flex-col justify-center items-center h-screen">
          <img src="/logo.png" alt="logo" className="logo w-md"></img>
          <p className="touchStart text-[1.5rem] bottom-[2rem] absolute font-medium text-white">Click to Start</p>
        </div>
      </Link>
      <FullScreenButton/>
    </main>
  );
}