import io from "socket.io-client";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

import { SOCKET_URL } from "../config/default";
import EVENTS from "@/config/event.config";

const socket = io(SOCKET_URL);

type messageType = {
  username: string;
  message: string;
  time: string;
};

type socketContextType = {
  socket: ReturnType<typeof io>;
  setUsername?: Dispatch<SetStateAction<string>>;
  setMessage?: Dispatch<SetStateAction<messageType[]>>;
  meessages?: messageType[];
  username?: string;
  roomId?: string;
  rooms: Record<string, { name: string }>;
};

const SockerContext = createContext<socketContextType>({ socket, rooms: {} });

function SocketsProvider(props: any) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState<Record<string, { name: string }>>({});
  const [meessages, setMessage] = useState<messageType[]>([]);
  useEffect(() => {
    window.onfocus = function () {
      document.title = "Chat App";
    };
  }, []);
  useEffect(() => {
    if (localStorage.getItem("username")) {
      setUsername(localStorage.getItem("username") as string);
    }
  }, []);

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });
  socket.on(EVENTS.SERVER.JOINED_ROOM, (val) => {
    setRoomId(val);
    setMessage([]);
  });
  socket.on(EVENTS.SERVER.ROOM_MESSAGE, (val) => {
    if (!document.hasFocus()) {
      document.title = "New Message....";
    }
    setMessage([...meessages, { ...val }]);
  });
  return (
    <SockerContext.Provider
      value={{
        socket,
        username,
        setUsername,
        rooms,
        roomId,
        meessages,
        setMessage,
      }}
    >
      {props.children}
    </SockerContext.Provider>
  );
}

export const useSockets = () => useContext(SockerContext);

export default SocketsProvider;
