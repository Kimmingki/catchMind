const body = document.querySelector("body");

// 유저 접속 및 퇴장 시 뷰 페이지 변경
const fireNotification = (text, color) => {
  const notification = document.createElement("div");
  notification.innerText = text;
  notification.style.backgroundColor = color;
  notification.className = "notification";
  body.appendChild(notification);
};

// 유저 접속 시
export const handleNewUser = ({ nickname }) =>
  fireNotification(`${nickname} just joined!`, "rgb(0, 122, 255)");

// 유저 퇴장 시
export const handleDisconnected = ({ nickname }) =>
  fireNotification(`${nickname} just left!`, "rgb(255, 59, 48)");
