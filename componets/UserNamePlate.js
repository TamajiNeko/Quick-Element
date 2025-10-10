export default function UserNamePlate({ username }) {
  return (
    <div className="flex flex-row gap-[.5rem] items-center absolute right-[1rem] top-[.75rem]">
      <p className="text-[2rem]">{username || 'N/A'}</p>
    </div>
  );
}