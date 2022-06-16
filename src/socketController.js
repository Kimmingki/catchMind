import events from "./events";

const socketController = (socket) => {
  socket.on(events.setNickName, ({ nickname }) => {
    socket.broadcast.emit(events.newUser, { nickname });
    socket.nickname = nickname;
  });
};

export default socketController;
