'use client';

import React from 'react';

export default function Deck({ isMyTurn, playerName, onDrawACard }){
    
    const cursorClass = isMyTurn ? 'cursor-pointer hover:scale-[1.05] transition-transform duration-200' : 'cursor-not-allowed';
    const opacityClass = isMyTurn ? 'opacity-100' : 'opacity-70';

    const handleDeckClick = () => {
        if (isMyTurn && onDrawACard) {
            onDrawACard();
        }
    };

    return (
        <img 
            src={`/cards/back.png`}
            alt={`Deck - Click to Draw`}
            className={`
                fixed top-[35%] right-10 w-[180px] h-[265px] z-30 shadow-2xl rounded-[.5rem]
                ${cursorClass}
                ${opacityClass}
            `}
            onClick={() => handleDeckClick()}
        />
    )
}