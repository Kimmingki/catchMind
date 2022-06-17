import events from "./events";

// 유저 정보 array
let sockets = [];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const superBroadcast = (event, data) => io.emit(event, data);
  const sendPlayerUpdate = () =>
    superBroadcast(events.playerUpdate, { sockets });

  // 로그인 이벤트 대기
  socket.on(events.setNickName, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, points: 0, nickname });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
  });

  // 연결 해제 이벤트 대기
  socket.on(events.disconnect, () => {
    sockets = sockets.filter((aSocket) => aSocket.id !== socket.id);
    broadcast(events.disconnected, { nickname: socket.nickname });
    sendPlayerUpdate();
  });

  // 메세지 이벤트 대기
  socket.on(events.sendMsg, ({ message }) => {
    broadcast(events.newMsg, { message, nickname: socket.nickname });
  });

  // 캔버스 마우스 이벤트 대기
  socket.on(events.beginPath, ({ x, y }) =>
    broadcast(events.beganPath, { x, y })
  );

  // 그림 그리기 이벤트 대기
  socket.on(events.strokePath, ({ x, y, color }) =>
    broadcast(events.strokedPath, { x, y, color })
  );

  // 채우기 이벤트 대기
  socket.on(events.fill, ({ color }) => {
    broadcast(events.filled, { color });
  });
};

export default socketController;
