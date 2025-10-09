import React, { useState, useEffect } from 'react';

function parseInputString(text) {
    const regex = /([A-Za-z]+)(\d+)/g;
    const data = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        data.push({
            element: match[1],
            group: parseInt(match[2], 10)
        });
    }
    return data;
}

function generateFormulaFromGroupString(inputString) {
    const parsedData = parseInputString(inputString);
    if (parsedData.length === 0) return "a simple compound";

    const elementMap = new Map();

    parsedData.forEach(item => {
        const { element, group } = item;
        
        if (!elementMap.has(element)) {
            elementMap.set(element, {
                element: element,
                group: group,
                count: 0
            });
        }
        elementMap.get(element).count++;
    });

    let elements = Array.from(elementMap.values());

    elements.sort((a, b) => {
        if (a.group !== b.group) {
            return a.group - b.group;
        }
        return a.element.localeCompare(b.element);
    });

    const formulaElements = elements.map((item, index) => {
        const count = item.count;
        const countDisplay = count > 1 ? 
            <sub key={`${item.element}-${index}`}>{count}</sub> 
            : null;
            
        return (
            <React.Fragment key={item.element}>
                {item.element}
                {countDisplay}
            </React.Fragment>
        );
    });

    return formulaElements;
}

const TurnNotificationOverlay = ({ currentTurn, bondMaker, map, drawACard, visible, onClose }) => {
    if (!visible) return null;

    let finalNotification = null;

    if (bondMaker) {
        let rawFormulaString = "";
        
        for (const key in map) {
            const value = map[key];
            
            if (value.element && value.group) {
                const groupNumber = String(value.group).charAt(0);
                rawFormulaString += value.element + groupNumber;
            }
        }
        
        const finalFormulaDisplay = generateFormulaFromGroupString(rawFormulaString);

        finalNotification = (
            <>
                {bondMaker} created <span className='text-[#39b8ff]'>{finalFormulaDisplay}</span>! ({drawACard} Draw a card)
            </>
        );

    } else {
        finalNotification = (
            <>
                Nothing happened, {currentTurn} Turn!
            </>
        );
    }

    return (
        <div
            className="fixed bg-gray-900 inset-0 flex justify-center items-center z-[100]"
            onClick={onClose}
        >
                <p className="text-4xl font-black text-white">
                    {finalNotification} 
                </p>
        </div>
    );
};
export default function TurnDisplay({ turn, drawACard, bondMaker, map }) {

    const [showOverlay, setShowOverlay] = useState(false);
    const lastNotifiedTurnRef = React.useRef(turn);

    useEffect(() => {
        if (turn && turn !== lastNotifiedTurnRef.current) {
            setShowOverlay(true);
            lastNotifiedTurnRef.current = turn;
        } 
    }, [turn]);

    const handleCloseOverlay = () => {
        setShowOverlay(false);
    };

    return (
        <>
            <div className="flex flex-row gap-[.5rem] items-center absolute left-[1rem] bottom-[.5rem] z-50">
                <p className="text-[1.5rem] text-white p-2">
                    {`${turn} Turn!`}
                </p>
            </div>

            <TurnNotificationOverlay
                currentTurn={turn}
                drawACard={drawACard}
                bondMaker={bondMaker}
                map={map}
                visible={showOverlay}
                onClose={handleCloseOverlay}
            />
        </>
    );
}