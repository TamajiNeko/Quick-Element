'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Page() {

  useEffect(() => {
    document.title = "Quick Element";
  }, []);
  
  return (
    <main>
      <Link href="/lobby" draggable="false" className="felx w-screen h-screen">
        <div className="flex flex-col justify-center items-center h-screen"xxx>
          <img src="/logo.png" draggable="false" alt="logo" className="logo w-md"></img>
          <p className="touchStart text-[1.5rem] bottom-[2rem] absolute font-medium text-white">Click to Start</p>
        </div>
      </Link>
    </main>
  );
}