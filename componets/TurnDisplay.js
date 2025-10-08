import React, { useState, useEffect } from 'react';

const TurnNotificationOverlay = ({ currentTurn, visible, onClose }) => {
    if (!visible) return null;

    return (
        <div 
            className="fixed bg-gray-500/50 inset-0 flex justify-center items-center z-[100]" 
            onClick={onClose} 
        >
            <div 
                className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg mx-4"
                onClick={(e) => e.stopPropagation()} 
            >
                <p className="text-4xl font-black text-[#39b8ff]">
                    {currentTurn} Turn!
                </p>

            </div>
        </div>
    );
};

export default function TurnDisplay(turn) {
    const currentTurn = turn.turn; 
    
    const [showOverlay, setShowOverlay] = useState(false);
    const lastNotifiedTurnRef = React.useRef(currentTurn); 

    useEffect(() => {
        if (currentTurn && currentTurn !== lastNotifiedTurnRef.current) {
            setShowOverlay(true);
            lastNotifiedTurnRef.current = currentTurn;
        }
    }, [currentTurn]); 

    const handleCloseOverlay = () => {
        setShowOverlay(false);
    };

    return (
        <>
            <div className="flex flex-row gap-[.5rem] items-center absolute left-[1rem] bottom-[.5rem] z-50">
                <p className="text-[1.5rem] text-white p-2">
                    {`${currentTurn} Turn!`}
                </p>
            </div>

            <TurnNotificationOverlay
                currentTurn={currentTurn}
                visible={showOverlay}
                onClose={handleCloseOverlay}
            />
        </>
    );
}