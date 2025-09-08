
export default function RoomCodeGenerator() {
  return Math.random().toString(36).substring(2, 8);
}