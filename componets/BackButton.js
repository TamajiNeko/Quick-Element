export default function BackButton_({function_}){
    return (
        <div className="flex flex-row gap-[.5rem] items-center absolute left-[1rem] top-[.5rem]">
            <a onClick={function_}>
                <img src="/back.svg" id="toggleFullscreenImage" className="w-10 h-10 cursor-pointer"></img>
            </a>
        </div>
    )
}