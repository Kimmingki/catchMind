# CatchMind 따라해보기!

## Preview

https://user-images.githubusercontent.com/27759684/174439068-162d85cd-f0e3-4d34-85f0-03de60d6c734.mp4

---

### 기능 기획

- 접속 및 퇴장
- 채팅 기능
  - 닉네임
  - 메세지
- 그림판 기능
  - 이전 drawing board 기능 따오기
- 게임 기능
  - 게임 시작 및 종료
  - 정답자 포인트
  - 제시어

통신은 대부분 SocketIO를 통하여 진행

---

### Tech

- Server
  - NodeJS / express
  - SocketIO
- Client
  - Pug

---

### Login / 접속

로그인 시스템은 일반적으로 알고 있는 시스템이 아닌 단순히 닉네임만 전달 받는 느낌으로 만들었다.

```javascript
// socketController.js
// 로그인 이벤트 대기
socket.on(events.setNickName, ({ nickname }) => {
  socket.nickname = nickname;
  sockets.push({ id: socket.id, points: 0, nickname });
  broadcast(events.newUser, { nickname });
  sendPlayerUpdate();
  startGame();
});
```

setNickname이라는 이벤트를 확인하면 전달받은 nickname을 저장하고 여러 유저 정보를 담기 위하여
<br>
미리 만들어둔 **sockets** obj에 push를 한 뒤 기존에 있는 유저들에게
<br>
새로 들어온 유저의 정보를 보내주고 업데이트 한뒤 게임을 시작한다.

**유저가 서버에 접근해 닉네임을 입력하는 과정 속에서 이벤트를 발생시키는 내용은 login.js에서 확인할 수 있다.**

---

### 퇴장

```javascript
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
```

if문을 통하여 유저가 1명 남았을 때 게임이 자동으로 종료되도록 설정하고
<br>
퇴장한 인원의 정보를 가져와 다른 인원에게 퇴장함을 알리고 유저 정보를 업데이트 한다.

---

### Chat

채팅 시스템에서 고려해야할 항목

1. 본인과 다른 사람의 채팅을 구별할 것
2. 그림을 그리는 사람은 채팅을 할 수 없을 것

```javascript
// socketController.js
// 메세지 이벤트 대기
socket.on(events.sendMsg, ({ message }) => {
  if (message === word) {
    superBroadcast(events.newMsg, {
      message: `${socket.nickname} 님이 맞췄습니다. 정답: ${word}`,
      nickname: "Bot",
    });
    addPoints(socket.id);
  } else {
    broadcast(events.newMsg, { message, nickname: socket.nickname });
  }
});
```

일반적인 채팅의 내용은 else문에 들어있으며
<br>
broadcast.emit을 통하여 다른 사람들에게 나의 메세지와 닉네임을 다른 인원에게 전달한다.
<br>
그리고 채팅의 내용 중 정답이 있을 경우 io.emit을 통하여 모든 인원들에게 "Bot"이라는 닉네임으로
<br>
정답자와 정답을 확인하도록 한다.

**채팅 전송 관련 로직은 chat.js에서 확인 할수 있다.**

---

### 게임 설정

- 게임 시작

  ```javascript
  // socketController.js
  // 게임 시작 시 로직
  const startGame = () => {
    if (sockets.length > 1) {
      if (inProgress === false) {
        inProgress = true;
        leader = chooseLeader();
        word = chooseWord();
        superBroadcast(events.gameStarting);
        setTimeout(() => {
          superBroadcast(events.gameStarted);
          io.to(leader.id).emit(events.leaderNotif, { word });
          timeout = setTimeout(endGame, 30000);
        }, 3000);
      }
    }
  };
  ```

  우선 게임 시작 전에 인원의 수를 체크해야 한다. 혼자 게임을 진행할 수 없기 때문에 미리 정의해뒀던
  <br>
  sockets obj(유저 정보)에서 1이상을 체크하고 시작한다.
  <br>
  우선 랜덤으로 유저 중에서 leader(그림 그리는 사람)를 선택하고 단어를 설정한 뒤
  <br>
  게임 시작 이벤트를 발송한다.

- 게임 종료

  ```javascript
  // 게임 종료 시 로직
  const endGame = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    inProgress = false;
    superBroadcast(events.gameEnded);
    setTimeout(() => startGame(), 3000);
  };

  // 맞춘 사람 포인트 주고 게임 종료
  const addPoints = (id) => {
    sockets = sockets.map((socket) => {
      if (socket.id === id) {
        socket.points += 10;
      }
      return socket;
    });
    sendPlayerUpdate();
    endGame();
    clearTimeout(timeout);
  };
  ```

  우선 게임을 종료할 때 기존 timeout 설정을 초기화하고 게임 종료 알림과 함께 새 게임을 준비한다.
  <br>
  또한 유저가 정답을 맞췄을 경우 해당 유저에게 포인트를 지급한 뒤
  <br>
  유저 정보를 업데이트 하고 게임 종료 로직이 다시 작동하도록 만들었다.

  **게임 기능에 관한 세부 로직은 plyaers.js에서 확인 할 수 있다.**

---
