import EVENTS from "@/config/event.config";
import { useSockets } from "@/context/socket.context";
import { useRef } from "react";
import styles from "@/styles/Room.module.css";

function RoomsContainer(): JSX.Element {
  const { socket, rooms, roomId } = useSockets();
  const newRoomRef = useRef<HTMLInputElement>(null);
  const handleCreateRoom = () => {
    //*Get Room Name
    const value = newRoomRef.current?.value || "";
    if (!String(value).trim()) {
      return;
    }
    //*Emit room creation event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName: value });
    //*Set room name input to empty string
    if (newRoomRef.current) newRoomRef.current.value = "";
  };
  const handleJoinRoom = (key: string) => {
    if (key == roomId) {
      return;
    }
    socket.emit(EVENTS.CLIENT.JOINED_ROOM, {
      roomId: key,
    });
  };
  return (
    <nav className={styles.wrapper}>
      <div className={styles.createRoomWrapper}>
        <input ref={newRoomRef} placeholder="Enter Room Name" />
        <button className="cta" onClick={handleCreateRoom}>
          Create Room
        </button>
      </div>
      <ul className={styles.roomList}>
        {Object.keys(rooms).map((key) => {
          return (
            <div key={key}>
              <button
                disabled={key === roomId}
                onClick={() => {
                  handleJoinRoom(key);
                }}
              >
                JOIN ROOM {rooms[key].name}
              </button>
            </div>
          );
        })}
      </ul>
    </nav>
  );
}
export default RoomsContainer;
