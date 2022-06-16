import { initSocket } from "./sockets";

const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

const nickname = localStorage.getItem(NICKNAME);

// 로그인 이벤트 전송
const logIn = (nickname) => {
  // eslint-disable-next-line no-undef
  const socket = io("/");
  socket.emit(window.events.setNickName, { nickname });
  initSocket(socket);
};

// 로그인 시 작동
const handleFormSubmit = (e) => {
  e.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  input.value = "";
  localStorage.setItem(NICKNAME, value);
  body.className = LOGGED_IN;
  logIn(value);
};

if (nickname === null) {
  body.className = LOGGED_OUT;
} else {
  body.className = LOGGED_IN;
  logIn(nickname);
}

if (loginForm) {
  loginForm.addEventListener("submit", handleFormSubmit);
}
