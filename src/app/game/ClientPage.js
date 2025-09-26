"use client";

import React from "react";

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
      let response = await fetch(`/api/map_data?get_map=${room}`);

      if (!response.ok) {
        const fallback = await fetch(`/api/room?get_room=${room}`);
        if (!fallback.ok) {
          throw new Error("Room Not Found in Server");
        }

        await fetch("/api/map_data?make=true", {
          method: "POST"
        });

        response = fallback;
      }

      const data = await response.json();
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
    if (!room) {
      this.setState({ loading: false });
      return;
    }
    this.fetchRoomData();
    this.intervalId = setInterval(this.fetchRoomData, 3000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    const { roomData, loading } = this.state;

    return (
      <main>
        <div className="flex flex-col justify-center items-center h-screen">
          {loading ? (
            <p className="text-[1.5rem]">Loading...</p>
          ) : roomData ? (
            <p className="text-[1.45rem]">Server Works, But i've no passion to continue yet :/</p>
          ) : (
            <p className="text-[1.45rem]">Room not found ｡°(°¯᷄◠¯᷅°)°｡</p>
          )}
        </div>
      </main>
    );
  }
}

export default RoomDisplay;
