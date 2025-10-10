export default function RoomCodePlate({ code }) {
  const handleCopy = async() => {
      await navigator.clipboard.writeText(code);
      alert("Code Copied!")
  }
  return (
    <div className="flex flex-row gap-[.5rem] items-center justify-center absolute w-screen top-[.75rem]">
      <p onClick={handleCopy} className="text-[2rem] cursor-pointer">Code: {code || 'N/A'}</p>
    </div>
  );
}