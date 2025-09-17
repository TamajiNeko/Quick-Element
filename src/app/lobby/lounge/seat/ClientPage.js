"use client";

import React from "react";
import UserNamePlate from "../../../../../componets/UserNamePlate";
import RoomCodePlate from "../../../../../componets/RoomCodePlate";

class RoomDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomData: null,
      loading: true,
    };
    this.intervalId = null;
    this.fetchRoomData = this.fetchRoomData.bind(this);
  }

  async fetchRoomData() {
    const { room } = this.props;
    try {
      const res = await fetch(`/api/room?get=${room}`);
      if (!res.ok) {
        throw new Error("Room Not Found in Server");
      }
      const data = await res.json();
      this.setState({ roomData: data });
    } catch (error) {
      console.error("Polling error:", error);
      this.setState({ roomData: null });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const { room } = this.props;
    if (!room || room === "N/A") {
      this.setState({ loading: false });
      return;
    }
    this.fetchRoomData();
    this.intervalId = setInterval(this.fetchRoomData, 5000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    const { username, room } = this.props;
    const { roomData, loading } = this.state;

    return (
      <main>
        <UserNamePlate username={username} />
        <RoomCodePlate code={room} />
        <div className="flex flex-col justify-center items-center h-screen">
          {loading ? (
            <p className="text-[1.5rem]">Loading...</p>
          ) : roomData ? (
            <div className='EnterForm flex flex-col items-center justify-center bg-white rounded-2xl w-[50vh] h-[25vh] text-[1.5rem]'>
              <div className="w-[80%] mb-[0.5rem] flex flex-row">
                <p className="text-[#39b8ff] font-black mr-[0.5rem]">P1</p><p className="text-black">{roomData.playerA}</p>
              </div>
              <div className="w-[80%] flex flex-row">
                <p className="text-[#39b8ff] font-black mr-[0.5rem]">P2</p><p className="text-black mb-[1.6rem]">{roomData.playerB}</p>
              </div>
              <button type="submit" className='flex justify-center w-[40%] h-[20%] rounded-4xl text-white text-center font-[700] bg-[#39b8ff] cursor-pointer'>Ready</button>
            </div>
          ) : (
              <p className="text-[1.45rem]">Room not found ｡°(°¯᷄◠¯᷅°)°｡</p>
          )
          }
        </div>
      </main>
    );
  }
}

export default RoomDisplay;
