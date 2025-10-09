'use client';

import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "localhost:3001"; 

export default function PlayerHand({ type, room, playerName, onCardSelected, mapSignal }) {
    const [handData, setHandData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTurnPlayer, setCurrentTurnPlayer] = useState(null);

    const getPlayerNameSlice = playerName.slice(1);

    const setupSocket = useCallback(() => {
        if (!room || !playerName) {
            setIsLoading(false);
            return;
        }

        const socket = io(SOCKET_SERVER_URL);

        socket.on('connect', () => {
            socket.emit('enterRoom', room); 
        });

        socket.on('gameUpdate', (data) => {
            const isPlayerA = getPlayerNameSlice === data.playerA;
            const handColumn = isPlayerA ? 'handA' : 'handB'; 
            const opponentHandColumn = isPlayerA ? 'handB' : 'handA';

            let handToSet = {};
            
            if (type === 'you') {
                handToSet = data[handColumn];
            } else {
                const opponentHand = data[opponentHandColumn];
                if(opponentHand) {
                    handToSet = Object.fromEntries(
                        Object.keys(opponentHand).map(key => [key, { element: 'back' }])
                    );
                }
            }
            
            setHandData(handToSet);
            setCurrentTurnPlayer(data[data.turn]);
            setIsLoading(false);
            setError(null);
        });

        socket.on('connect_error', (err) => {
            setError('Socket connection failed. Cannot load hand data.');
            setIsLoading(false);
        });

        return () => {
            socket.off('gameUpdate');
            socket.disconnect();
        };

    }, [room, playerName, type]);

    useEffect(() => {
        const cleanup = setupSocket();
        return cleanup;
    }, [mapSignal, setupSocket]); 


    const positionClass = type === 'you' 
        ? "fixed bottom-[-4rem] z-20"
        : "fixed top-[-4rem] z-20";

    const isMyTurn = currentTurnPlayer === getPlayerNameSlice;


    const handleCardClick = (cardName, cardID, maxValue, group) => {
        if (onCardSelected && isMyTurn) {
            onCardSelected(cardName, cardID, maxValue, group);
        }
    };

    if (isLoading) {
        return (
            <div className={`flex flex-row justify-center items-center w-screen ${positionClass}`}>
                <p className="text-[1.5rem] p-4">Loading hand...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-row justify-center items-center w-screen ${positionClass}`}>
                <p className="text-[1.5rem] p-4 text-red-500">Error: {error}</p>
            </div>
        );
    }

    const renderCard = (cardData, cardName, cardID) => {
        const imgSrc = type === 'you' ? `cards/${cardData.element}.svg` : 'cards/back.png';
        const altText = type === 'you' ? cardName : 'Opponent\'s Card Back'; 
        const hoverClass = type === 'you' && isMyTurn ? 'transition-transform duration-300 hover:-translate-y-16' : '';
        const transformClass = type === 'opponents' 
            ? "rotate-180" 
            : "";
        
        const overlay = type === 'you' && cardData.max_value !== undefined ? (
            <img 
                src={`/bond/${cardData.max_value}.svg`}
                alt={`Max value ${cardData.max_value} overlay`}
                className="absolute top-0 right-0 w-[180px] h-[265px] z-30" 
            />
        ) : null;

        return (
            <div
                key={cardID}
                className={`
                    relative board-cell w-[180px] h-[265px] flex flex-col shadow-xl p-0 corner rounded-[.5rem]
                    justify-center items-center text-center text-xs ml-[-1.5rem] z-20
                    ${hoverClass}
                    ${transformClass} 
                    ${isMyTurn && type === 'you' ? 'cursor-pointer' : 'cursor-not-allowed'} 
                `}
                onClick={isMyTurn && type === 'you' ? () => handleCardClick(cardData.element, cardID, cardData.max_value, cardData.group) : undefined}
            >
                <img 
                    src={imgSrc} 
                    alt={altText} 
                    className="w-full h-full object-cover rounded-[.5rem] z-20"
                />
                
                {overlay}
            </div>
        );
    };

    return (
        <div className={`flex flex-row justify-center items-center w-screen ${positionClass}`}>
            {handData && Object.entries(handData).map(([cardID, cardData]) => 
                renderCard(cardData, cardData.element || 'back', cardID)
            )}
        </div>
    );
}