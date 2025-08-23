import Link from "next/link";

export const metadata = {
  title: 'Quick Element'
}

export default function HomePage() {
  return (
    <main>
      <Link href="/lobby" className="felx w-screen h-screen">
        <div className="flex flex-col justify-center items-center h-screen">
          <img src="/logo.png" alt="logo" className="logo w-md"></img>
          <p className="text-[1.5rem] bottom-[2rem] absolute">Click to Start</p>
        </div>
      </Link>
    </main>
  );
}