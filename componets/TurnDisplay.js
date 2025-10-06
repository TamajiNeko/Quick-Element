export default function TurnDisplay(turn){
    return (
        <div className="flex flex-row gap-[.5rem] items-center absolute left-[1rem] bottom-[.5rem] z-50">
            <p className="text-[1.5rem]">{`${turn.turn} Turn!` || 'N/A'}</p>
        </div>
    )
}