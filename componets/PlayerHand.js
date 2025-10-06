'use client';

import { useState, useEffect, useCallback } from 'react';

export default function PlayerHand({ type, room, playerName, onCardSelected, mapSignal}) {
    const [handData, setHandData] = useState(null);
    const [turn, setTurn] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlayerHand = useCallback(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout 10 วินาที

        try {
            if (!room || !playerName) {
                setIsLoading(false);
                return;
            }
            
            const hand = await fetch(`/api/map_data?get_map=${room}&hand=${playerName}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!hand.ok) {
                throw new Error("Room Not Found in Server or API Error");
            }

            const data = await hand.json();
            setHandData(data.hand);
            setTurn(data.turn);
            setError(null);

        } catch (err) {
            if (err.name === 'AbortError') {
                setError("Request timed out. Server is too slow.");
            } else {
                setError(err.message);
            }
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    }, [room, playerName, mapSignal]);

    useEffect(() => {
        fetchPlayerHand();
    }, [fetchPlayerHand]);

    
    const positionClass = type === 'you' 
        ? "fixed bottom-[-4rem] z-20"
        : "fixed top-[-4rem] z-20";

    const isMyTurn = turn === playerName.slice(1);


    const handleCardClick = (cardName, cardID, maxValue) => {
        if (onCardSelected) {
            onCardSelected(cardName, cardID, maxValue);
        }
    };

    if (isLoading) {
        return (
            <div className={positionClass}>
                <p className="text-[1.5rem] p-4">Loading hand...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={positionClass}>
                <p className="text-[1.5rem] p-4 text-red-500">Error: {error}</p>
            </div>
        );
    }

    const renderCard = (cardData, cardName, cardID) => {
        const imgSrc = type === 'you' ? `cards/${cardData.element}.svg` : 'cards/back.png';
        const hoverClass = type === 'you' && isMyTurn ? 'transition-transform duration-300 hover:-translate-y-16' : '';
        const altText = type === 'you' ? cardName : 'Opponent\'s Card Back'; 

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
                    ${isMyTurn ? 'cursor-pointer' : 'cursor-not-allowed'} 
                `}
                onClick={isMyTurn ? () => handleCardClick(cardName, cardID, cardData.max_value) : undefined}
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
                renderCard(cardData, cardData.element, cardID)
            )}
        </div>
    );
}