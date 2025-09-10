export default function RoomCodePlate({ code }) {
  return (
    <div className="flex flex-row gap-[.5rem] items-center justify-center absolute w-screen top-[.75rem]">
      <p className="text-[1.25rem]">Code: {code || 'N/A'}</p>
    </div>
  );
}