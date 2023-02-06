import { Server, Socket } from "socket.io";
import log from "./utils/logger";
import { v4 as uuidv4 } from "uuid";

// import { nanoid } from "nanoid";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    JOINED_ROOM: "JOINED_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  log.info("Socket enable");
  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`User Connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    //?When user create a new room
    socket.on(
      EVENTS.CLIENT.CREATE_ROOM,
      ({ roomName }: { roomName: string }) => {
        log.info(roomName);
        //*Create a roomId
        const roomId = uuidv4();
        //*Add new Room To Room Object
        rooms[roomId] = {
          name: roomName,
        };
        //*socket.join(roomId)
        socket.join(roomId);
        //*Broadcast an event saying there is a new room
        socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
        //*Sent all the rooms detail
        socket.emit(EVENTS.SERVER.ROOMS, rooms);
        //*JOined particular room
        socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
      }
    );
    //?When user send a new message in a room
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({
        roomId,
        username,
        message,
      }: {
        roomId: string;
        username: string;
        message: string;
      }) => {
        const date = new Date();
        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );
    //?When user joins a new room
    socket.on(EVENTS.CLIENT.JOINED_ROOM, ({ roomId }: { roomId: string }) => {
      socket.join(roomId);
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
