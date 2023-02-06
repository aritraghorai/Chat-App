import MessagesContainer from "@/Containers/Messages";
import RoomsContainer from "@/Containers/Rooms";
import { useSockets } from "@/context/socket.context";
import { useRef } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { socket, setUsername, username } = useSockets();
  const usernameRef = useRef<HTMLInputElement>(null);
  const handleUsername = () => {
    const value = usernameRef.current?.value;
    if (!value) {
      return;
    }
    if (setUsername) setUsername(value);
    localStorage.setItem("username", value);
  };

  return (
    <div>
      {!username ? (
        <div className={styles.usernameWrapper}>
          <div className={styles.usernameInner}>
            <input type="Username" placeholder="Username" ref={usernameRef} />
            <button className="cta" onClick={handleUsername}>
              START
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <RoomsContainer />
          <MessagesContainer />
        </div>
      )}
    </div>
  );
}
