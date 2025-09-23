"use client";

import React from "react";
import UserNamePlate from "../../../../../componets/UserNamePlate";
import RoomCodePlate from "../../../../../componets/RoomCodePlate";
import ReadyForm from "./ReadyForm";

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
      if (data.AReady == 1 && data.BReady == 1) {
        window.location.href = "/game";
      }
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
    this.intervalId = setInterval(this.fetchRoomData, 500);
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
            <ReadyForm username={username} playerA={roomData.playerA} playerB={roomData.playerB}
              readyStatsA={roomData.AReady} readyStatsB={roomData.BReady} />
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
