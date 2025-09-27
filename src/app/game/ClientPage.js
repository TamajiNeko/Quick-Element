"use client";

import React from "react";
import boardManager from "./BoardManager"; 
import { Leave } from "../../../lib/Leave";
import BackButton_ from "../../../componets/BackButton";

export default class mapDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapData: null,
            loading: true,
            
            // สถานะสำหรับการคลิ๊กลาก
            isDragging: false,
            startX: 0,
            startY: 0,
            scrollLeft: 0,
            scrollTop: 0,
            // Flag ใหม่: ตรวจจับว่ามีการลากเกิน threshold (ระยะที่กำหนด) แล้วหรือไม่
            isDragDetected: false, 
        };
        this.intervalId = null;
        this.fetchmapData = this.fetchmapData.bind(this);
        this.scrollContainerRef = React.createRef(); 
        
        // ผูก Methods สำหรับการลาก
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.centerScroll = this.centerScroll.bind(this);
    }
    // --- Data Fetching Logic ---

    async fetchmapData() {
        const { room } = this.props;
        try {
            let response = await fetch(`/api/map_data?get_map=${room}`);

            if (!response.ok) {
                const fallback = await fetch(`/api/room?get_room=${room}`);
                if (!fallback.ok) {
                    throw new Error("Room Not Found in Server");
                }
                
                const initialBoardArray = new boardManager().createInitialGameBoardJSON();
                await fetch("/api/map_data?create_map=true", {
                    method: "POST",
                    body: JSON.stringify(initialBoardArray)
                });

                response = await fetch(`/api/map_data?get_map=${room}`);
                if (!response.ok) {
                   response = fallback; 
                }
                new boardManager().prepareGame();
            }

            const data = await response.json();
            this.setState({ mapData: data });
        } catch (error) {
            console.error("Polling error:", error);
            this.setState({ mapData: null });
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
        this.fetchmapData();
        this.intervalId = setInterval(this.fetchmapData, 500);
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (!prevState.mapData && this.state.mapData) {
            this.centerScroll();
        }
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        document.body.style.userSelect = 'auto'; 
    }

    // --- Drag-to-Scroll Handlers (AI Generated) ---

    handleMouseDown(e) {
        if (!this.scrollContainerRef.current) return;

        // ตรวจสอบว่าผู้ใช้คลิกซ้ายหรือไม่ (button 0) เพื่อไม่ให้กระทบกับการคลิกขวา
        if (e.button !== 0) return; 

        this.setState({
            isDragging: true,
            isDragDetected: false, // รีเซ็ตการตรวจจับการลาก
            startX: e.pageX - this.scrollContainerRef.current.offsetLeft,
            startY: e.pageY - this.scrollContainerRef.current.offsetTop,
            scrollLeft: this.scrollContainerRef.current.scrollLeft,
            scrollTop: this.scrollContainerRef.current.scrollTop,
        });
        document.body.style.userSelect = 'none'; 
    }

    handleMouseMove(e) {
        if (!this.state.isDragging || !this.scrollContainerRef.current) return;

        const x = e.pageX - this.scrollContainerRef.current.offsetLeft;
        const y = e.pageY - this.scrollContainerRef.current.offsetTop;
        
        const walkX = x - this.state.startX;
        const walkY = y - this.state.startY;
        
        const distance = Math.sqrt(walkX * walkX + walkY * walkY);
        const DRAG_THRESHOLD = 5; // กำหนดระยะห่างขั้นต่ำ (5 pixels) ที่ถือว่าเป็นการลาก

        // 1. ถ้ามีการลากเกิน Threshold ให้ตั้งค่า isDragDetected เป็น true
        if (distance > DRAG_THRESHOLD && !this.state.isDragDetected) {
            this.setState({ isDragDetected: true });
        }
        
        // 2. ถ้ามีการลากจริงแล้ว (isDragDetected เป็น true) 
        // ให้เรียก e.preventDefault() เพื่อบล็อก click event ที่ตามมา
        // ถ้าเป็นเพียงคลิกสั้นๆ (distance < 5) จะไม่เรียก preventDefault ทำให้ click ทำงานได้
        if (this.state.isDragDetected) {
            e.preventDefault(); 
        }

        // เลื่อน Scrollbar
        this.scrollContainerRef.current.scrollLeft = this.state.scrollLeft - walkX;
        this.scrollContainerRef.current.scrollTop = this.state.scrollTop - walkY;
    }

    handleMouseUp(e) {
        // เก็บสถานะการลากก่อน reset
        const wasDragDetected = this.state.isDragDetected;

        // รีเซ็ตสถานะ
        this.setState({ isDragging: false, isDragDetected: false });
        document.body.style.userSelect = 'auto'; 

        // เทคนิค: ถ้าเป็นการลากจริง (wasDragDetected = true) 
        // และมีเหตุการณ์เกิดขึ้น (e ไม่ใช่ null จาก onMouseLeave)
        // ให้ป้องกันการเกิด click event บน element ที่ถูกปล่อยเมาส์ (e.target)
        // นี่คือการจัดการกับ click event ที่เบราว์เซอร์สร้างขึ้นหลังจาก drag
        if (wasDragDetected && e) {
        }
    }

    centerScroll() {
        const container = this.scrollContainerRef.current;

        if (container) {
            const scrollX = (container.scrollWidth - container.clientWidth) / 2;
            const scrollY = (container.scrollHeight - container.clientHeight) / 2;

            container.scrollTo({
                left: scrollX,
                top: scrollY
            });
        }
    }

    render() {
        const { mapData, loading } = this.state;
        const boardMap = mapData ? mapData.map : null; 

        const renderBoard = () => {
            if (!boardMap || typeof boardMap !== 'object') {
                return <p>Data Error</p>;
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
                            onClick={() => console.log('Clicked cell:', key)} 
                            className="board-cell border p-1 w-[200px] h-[250px] flex flex-col justify-center items-center text-center text-xs bg-gray-100"
                        >
                            <span className="font-light text-[0.6rem] text-gray-500">{key}</span> 
                            <span className="text-lg font-bold text-black">{cellData?.element || cellData?.value || ''}</span>
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
                <div className="flex flex-col w-full h-full"> 
                    
                    {loading ? (
                        <p className="text-[1.5rem] flex justify-center items-center w-full flex-grow">
                            Loading...
                        </p>
                    ) : !mapData ? (
                        <div className="flex flex-col flex-grow justify-center items-center w-full">
                        <p className="text-[1.5rem] ">
                            404 | Room not found ｡°(°¯᷄◠¯᷅°)°｡
                        </p>
                        <BackButton_ function_={Leave('../lobby')}/>
                        </div>
                    ) : (
                        // Scroll Container
                        <div 
                            className={"flex-grow overflow-hidden"}
                            ref={this.scrollContainerRef}
                            onMouseDown={this.handleMouseDown}
                            onMouseUp={this.handleMouseUp}
                            onMouseLeave={this.handleMouseUp} 
                            onMouseMove={this.handleMouseMove}
                        > 
                            {renderBoard()} 
                        </div>
                    )}
                </div>
            </main>
        );
    }
}