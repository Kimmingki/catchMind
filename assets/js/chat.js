import { getSocket } from "./sockets";

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");

// 메세지 전송 시 뷰 페이지 변경
const appendMsg = (text, nickname) => {
  const li = document.createElement("li");
  li.innerHTML = `<span class="author ${nickname ? "out" : "self"}">${
    nickname ? nickname : "You"
  }:</span> ${text}`;
  messages.appendChild(li);
};

// 메세지 전송 이벤트
const handleSendMsg = (e) => {
  e.preventDefault();
  const input = sendMsg.querySelector("input");
  const { value } = input;
  getSocket().emit(window.events.sendMsg, { message: value });
  input.value = "";
  appendMsg(value);
};

// 메세지 전송
export const handleNewMessage = ({ message, nickname }) =>
  appendMsg(message, nickname);

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}
