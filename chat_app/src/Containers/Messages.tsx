import EVENTS from "@/config/event.config";
import { useSockets } from "@/context/socket.context";
import styles from "../styles/Message.module.css";
import { useEffect, useRef } from "react";

function MessagesContainer(): JSX.Element {
  const { socket, roomId, username, meessages, setMessage } = useSockets();
  const newMessageRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meessages]);
  const handleSendMessage = () => {
    const newMessage = newMessageRef.current?.value || "";
    if (!String(newMessage).trim()) {
      return;
    }
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
      roomId,
      username,
      message: newMessage,
    });
    const date = new Date();
    if (meessages && setMessage)
      setMessage([
        ...meessages,
        {
          username: "You",
          message: newMessage,
          time: `${date.getHours()}:${date.getMinutes()}`,
        },
      ]);
  };
  if (!roomId) {
    return <div></div>;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.messageList}>
        {meessages?.map((meessage, index) => {
          return (
            <div key={index} className={styles.message}>
              <div className={styles.messageInner}>
                <span className={styles.messageSender}>
                  {meessage.username}-{meessage.time}
                </span>
                <p>{meessage.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <div className={styles.messageBox}>
        <textarea
          ref={newMessageRef}
          name="newMessage"
          placeholder="Enter New Message"
          rows={1}
        />
        <button onClick={handleSendMessage}> SEND</button>
      </div>
    </div>
  );
}
export default MessagesContainer;
