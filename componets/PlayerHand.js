'use client';

import { useState, useEffect, useCallback } from 'react';

export default function PlayerHand({ type, room, playerName}) {
    const [handData, setHandData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlayerHand = useCallback(async () => {
        try {
            if (!room || !playerName) {
                setIsLoading(false);
                return;
            }
            
            const hand = await fetch(`/api/map_data?get_map=${room}&hand=${playerName}`);

            if (!hand.ok) {
                throw new Error("Room Not Found in Server or API Error");
            }

            const data = await hand.json();
            setHandData(data);
            setError(null);

        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [room, playerName]);

    useEffect(() => {
        fetchPlayerHand();
    }, [fetchPlayerHand]);

    
    const positionClass = type === 'you' 
        ? "fixed bottom-[-4rem] z-20"
        : "fixed top-[-4rem] z-10";

    const hoverClass = type === 'you' 
        ? "transition-transform duration-300 hover:-translate-y-16"
        : "";


    if (isLoading) {
        return <div className={`flex justify-center w-screen ${positionClass}`}>Loading hand...</div>;
    }

    if (error) {
        return <div className={`flex justify-center w-screen ${positionClass} text-red-500`}>Error loading player hand: {error}</div>;
    }
    
    if (!handData || Object.keys(handData).length === 0) {
        return <div className={`flex justify-center w-screen ${positionClass}`}>Hand is empty.</div>;
    }

    const cardKeys = Object.keys(handData);

    const handImages = cardKeys.map((cardName) => {
        const cardData = handData[cardName];
        
        if (!cardData || cardData.id === undefined) {
             return null; 
        }

        const imgSrc = type === 'you' 
            ? `/cards/${cardName}.svg`
            : `/cards/back.png`;

        const altText = type === 'you'
            ? cardName 
            : 'Opponent\'s Card Back'; 

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
                key={cardData.id}
                className={`
                    relative board-cell w-[180px] h-[265px] flex flex-col shadow-xl p-0 corner rounded-[.5rem]
                    justify-center items-center text-center text-xs ml-[-1.5rem] z-20
                    ${hoverClass}
                    ${transformClass} 
                `}
            >
                <img 
                    src={imgSrc} 
                    alt={altText} 
                    className="w-full h-full object-cover rounded-[.5rem] z-20"
                />
                
                {overlay}
            </div>
        );
    });

    return (
        <div className={`flex flex-row justify-center w-screen ${positionClass}`}>
            {handImages}
        </div>
    );
}