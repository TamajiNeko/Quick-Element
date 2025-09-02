import { cookies } from 'next/headers';
import FullScreenButton from "../../../../../componets/fullScreenButton"
import UserNamePlate from "../../../../../componets/userNamePlate"

export const metadata = {
  title: 'Seat - Quick Element'
}

export default function Page (){
    const cookieStore = cookies();
    const username = cookieStore.get('username')?.value || "N/A";

    return(
        <main>
            <UserNamePlate username={username}/>
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-[1.5rem]">Loading...</p>
            </div>
            <FullScreenButton/>
        </main>
    )
}