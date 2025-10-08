"use client";

import React from "react";
import io from "socket.io-client"; 
import PlayerHand from "../../../componets/PlayerHand"; 
import playerClass from "./playerClass";
import TurnDisplay from "../../../componets/TurnDisplay";

// ⚠️ ต้องตรงกับ Port ที่ Socket Server รันอยู่
const SOCKET_SERVER_URL = "http://localhost:3001"; 

export default class MapDisplay extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            mapData: null,
            loading: true,
            isDragging: false,
            startX: 0,
            startY: 0,
            scrollLeft: 0,
            scrollTop: 0,
            isDragDetected: false, 
        };
        // ❌ ลบ this.intervalId ออก
        // ❌ ลบ this.fetchmapData ออก
        this.socket = null; // 🆕 เพิ่ม socket instance
        this.scrollContainerRef = React.createRef(); 
        
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.centerScroll = this.centerScroll.bind(this);

        this.playerService = new playerClass(props.playerName); 

        this.handleCardSelected = this.handleCardSelected.bind(this);
        this.handleCardPlaced = this.handleCardPlaced.bind(this);
    }
    
    handleCardSelected(element, key, value){
        this.playerService.selectCard(element, key, value);
    }

    handleCardPlaced(coord){
        this.playerService.placeCard(coord, this.props.room, this.socket);
    }

    componentDidMount() {
        const { room } = this.props;
        if (!room) {
            this.setState({ loading: false });
            return;
        }

        this.socket = io(SOCKET_SERVER_URL);

        this.socket.on('connect', () => {
            this.socket.emit('enterRoom', room);
        });

        this.socket.on('gameUpdate', (data) => {
            const shouldCenter = !this.state.mapData;
            
            this.setState({ mapData: data, loading: false }, () => {
                if (shouldCenter) {
                    this.centerScroll();
                }
            });
        });
        
        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            this.setState({ loading: false, mapData: null }); 
        });

        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    componentWillUnmount() {
        if (this.socket) {
            this.socket.disconnect();
        }
        
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.body.style.userSelect = 'auto'; 
    }
    
    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.body.style.userSelect = 'auto'; 
    }

    handleMouseDown(e) {
        if (!this.scrollContainerRef.current) return;
        if (e.button !== 0) return; 

        this.setState({
            isDragging: true,
            isDragDetected: false, 
            startX: e.pageX, 
            startY: e.pageY,
            scrollLeft: this.scrollContainerRef.current.scrollLeft,
            scrollTop: this.scrollContainerRef.current.scrollTop,
        });
        document.body.style.userSelect = 'none'; 
    }

    handleMouseMove(e) {
        if (!this.state.isDragging || !this.scrollContainerRef.current) return;

        const x = e.pageX;
        const y = e.pageY;
        
        const walkX = x - this.state.startX;
        const walkY = y - this.state.startY;
        
        const distance = Math.sqrt(walkX * walkX + walkY * walkY);
        const DRAG_THRESHOLD = 5; 

        if (distance > DRAG_THRESHOLD && !this.state.isDragDetected) {
            this.setState({ isDragDetected: true });
        }
        
        e.preventDefault(); 

        this.scrollContainerRef.current.scrollLeft = this.state.scrollLeft - walkX;
        this.scrollContainerRef.current.scrollTop = this.state.scrollTop - walkY;
    }

    handleMouseUp(e) {
        if (!this.state.isDragging) return;
        
        const wasDragDetected = this.state.isDragDetected;

        this.setState({ isDragging: false, isDragDetected: false });
        document.body.style.userSelect = 'auto'; 

        if (wasDragDetected && e) {
        }
    }

    centerScroll() {
        const container = this.scrollContainerRef.current;
        if (container) {
            const scrollX = (container.scrollWidth - container.clientWidth) / 2;
            const scrollY = (container.scrollHeight - container.clientHeight) / 2;
            container.scrollTo({ left: scrollX, top: scrollY });
        }
    }

    render() {
        const { mapData, loading } = this.state;
        const { room, youPlayerName, opponentPlayerName } = this.props; 
        const boardMap = mapData ? mapData.map : null; 
        const mapSignal = mapData ? mapData.turn : null;
        let isMyTurn = false;

        const playerName = youPlayerName.slice(1);
        isMyTurn = mapData?.[mapData?.turn] === playerName;

        const renderBoard = () => {
            if (!boardMap || typeof boardMap !== 'object') {
                return <p className="text-red-500">Error: Board data is missing or corrupted.</p>;
            }

            const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
            let boardElements = [];

            rows.forEach(rowChar => {
                let rowCells = [];
                
                for (let j = 1; j <= 15; j++) {
                    const key = `${rowChar}${j}`; 
                    const cellData = boardMap[key]; 

                    rowCells.push(
                        <div 
                            key={key} 
                            className="board-cell p-1 w-[180px] h-[265px] flex flex-col justify-center items-center text-center text-xs"
                        >
                            {cellData?.element ? (
                                <div className="h-[258px]">
                                    <img 
                                        src={`cards/${cellData.element}.svg`} 
                                        alt={cellData.element}
                                        draggable="false"
                                        className="object-contain" 
                                    />
                                    <img 
                                        src={`bond/${cellData.bond}.svg`} 
                                        alt={cellData.element}
                                        draggable="false"
                                        className="object-contain relative top-[-100%] z-10" 
                                    />
                                </div>
                            ) : cellData?.value ? (
                                <div className="h-[258px]"
                                onClick={isMyTurn ? () => this.handleCardPlaced(key) : undefined}>
                                <img 
                                    src={`place holder.png`} 
                                    alt={cellData.element}
                                    draggable="false"
                                    className="object-contain" 
                                />
                                    <img 
                                        src={`bond/${cellData.value}_grey.svg`} 
                                        alt={cellData.element}
                                        draggable="false"
                                        className="object-contain relative top-[-132%] z-10 fill-{#515151}" 
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    );
                }
                
                boardElements.push(
                    <div key={rowChar} className="board-row flex">
                        {rowCells}
                    </div>
                );
            });

            return (
                <div className="game-board w-max"> 
                    {boardElements}
                </div>
            );
        };

        return (
            <main className="w-screen h-screen">
                {mapData && (
                    <>
                        <PlayerHand 
                            room={room} 
                            playerName={youPlayerName} 
                            type={"you"}
                            onCardSelected={this.handleCardSelected}
                            mapSignal={mapSignal}
                        />
                        <PlayerHand 
                            room={room} 
                            playerName={opponentPlayerName} 
                            type={"opponents"}
                            mapSignal={mapSignal}
                        />
                        <TurnDisplay turn={isMyTurn ? "Your" : `${mapData[mapData.turn]}'s`}/>
                    </>
                )}
                
                <div className="flex flex-col w-full h-full"> 
                    
                    {loading ? (
                        <p className="text-[1.5rem] flex justify-center items-center w-full flex-grow">
                            Connecting to Game Server...
                        </p>
                    ) : !mapData ? (
                        <div className="flex flex-col flex-grow justify-center items-center w-full">
                        <p className="text-[1.5rem] ">
                            404 | Room not found or connection failed ｡°(°¯᷄◠¯᷅°)°｡
                        </p>
                        </div>
                    ) : (
                        <div 
                            className={"flex-grow overflow-hidden z-0"}
                            ref={this.scrollContainerRef}
                            onMouseDown={this.handleMouseDown}
                        >
                            {renderBoard()}
                        </div>
                    )}
                </div>
            </main>
        );
    }
}