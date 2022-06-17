import events from "./events";
import { chooseWord } from "./words";

// --------- start variable ----------

let sockets = [];
let inProgress = false;
let word = null;
let leader = null;

// --------- end variable ----------

// choice painter
const chooseLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  // --------------------------- start function -------------------------

  const broadcast = (event, data) => socket.broadcast.emit(event, data);

  const superBroadcast = (event, data) => io.emit(event, data);

  const sendPlayerUpdate = () =>
    superBroadcast(events.playerUpdate, { sockets });

  // 게임 시작 시 로직
  const startGame = () => {
    if (inProgress === false) {
      inProgress = true;
      leader = chooseLeader();
      word = chooseWord();
      superBroadcast(events.gameStarting);
      setTimeout(() => {
        superBroadcast(events.gameStarted);
        io.to(leader.id).emit(events.leaderNotif, { word });
      }, 3000);
    }
  };

  // 게임 종료 시 로직
  const endGame = () => {
    inProgress = false;
    superBroadcast(events.gameEnded);
  };
  // --------------------------- end function -------------------------

  // ---------------------- start event ------------------------------
  // 로그인 이벤트 대기
  socket.on(events.setNickName, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, points: 0, nickname });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
    if (sockets.length === 2) {
      startGame();
    }
  });

  // 연결 해제 이벤트 대기
  socket.on(events.disconnect, () => {
    if (sockets.length === 1) {
      endGame();
    } else if (leader) {
      if (leader.id === socket.id) {
        endGame();
      }
    }
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

  // ---------------------- end event ------------------------------
};

export default socketController;
