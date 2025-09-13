"use client";

import { useState, useEffect } from 'react';
import UserNamePlate from "../../../../../componets/UserNamePlate";
import RoomCodePlate from "../../../../../componets/RoomCodePlate";

export default function ClientPage({ username, room }) {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!room || room === "N/A") {
      setLoading(false);
      return;
    }

    const fetchRoomData = async () => {
      try {
        const res = await fetch(`/api/room?get=${room}`);
        if (!res.ok) {
          throw new Error('Room Not Found in Server');
        }
        const data = await res.json();
        setRoomData(data);
      } catch (error) {
        console.error("Polling error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
    const intervalId = setInterval(fetchRoomData, 5000);
    return () => clearInterval(intervalId);
  }, [room]);

  return (
    <main>
      <UserNamePlate username={username} />
      <RoomCodePlate code={room} />
      <div className="flex flex-col justify-center items-center h-screen">
        {loading ? (
          <p className="text-[1.5rem]">Loading...</p>
        ) : roomData ? (
          <div>
            <h2 className="text-[1.5rem]">Room Details:</h2>
            <pre>{JSON.stringify(roomData, null, 2)}</pre>
          </div>
        ) : (
          <>
            <p className="text-[1.5rem]">Room not found ｡°(°¯᷄◠¯᷅°)°｡</p>
          </>
        )}
      </div>
    </main>
  );
}