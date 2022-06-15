import events from "./events";

const socketController = (socket) => {
  socket.on(events.setNickName, ({ nickname }) => {
    console.log(nickname);
    socket.nickname = nickname;
  });
};

export default socketController;
