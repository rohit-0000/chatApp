import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
let client = null;
export const connectToAllRooms = (roomIds, onMessageReceived, onMessageDeleted, onRoomDeleted,setCallStatus) => {

  if (!roomIds || roomIds.length === 0) {
    console.warn("No room IDs provided for subscription.");
    return null;
  }
  const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/chat`);

  client = Stomp.over(() => socket);

  client.connect({}, () => {
    console.log("web socket connected ");
    roomIds.forEach((roomId) => {
      client.subscribe(`/topic/room/${roomId}`, (message) => {
        onMessageReceived(roomId, JSON.parse(message.body));
      });

      client.subscribe(`/topic/room/${roomId}/delete`, (message) => {
        const deletedMessageId = message.body;
        onMessageDeleted(roomId, deletedMessageId);
      });

      client.subscribe("/topic/chatroom/delete", (message) => {
        const roomKey = message.body;
        onRoomDeleted(roomKey);
      });

      // Video call related subscriptions
      client.subscribe(`/topic/call/${roomId}`, (message) => {
        const callRoomId = message.body;
        setCallStatus("incoming",callRoomId);
        console.log("Incoming call in room:", callRoomId);
      });

      client.subscribe(`/topic/call/end/${roomId}`, (message) => {
        setCallStatus("ended",message.body);
        console.log("Call ended:", message.body);
      });
    });
  });

  client.onStompError = (frame) => {
    console.error("STOMP error", frame.headers["message"]);
  };
  client.onWebSocketError = (error) => {
    console.error("WebSocket error", error);
  };

  return client;
};

export {client};