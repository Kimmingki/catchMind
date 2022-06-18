import { disableChat, enableChat } from "./chat";
import {
  disableCanvas,
  enableCanvas,
  hideControls,
  resetCanvas,
  showControls,
} from "./paint";

const board = document.getElementById("jsPBoard");
const notifs = document.getElementById("jsNotifs");
const timer = document.getElementById("jsTime");

const addPlayers = (players) => {
  board.innerHTML = "";
  players.forEach((player) => {
    const playerElement = document.createElement("span");
    playerElement.innerText = `${player.nickname}: ${player.points}`;
    board.appendChild(playerElement);
  });
};

const setNotif = (word) => {
  notifs.innerText = "";
  if (word) {
    notifs.innerText = word;
  }
};

export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
export const handleGameStarted = () => {
  setNotif();
  disableCanvas();
  hideControls();
  enableChat();
};
export const handleLeaderNotif = ({ word }) => {
  enableCanvas();
  showControls();
  disableChat();
  setNotif(`당신 차례에요, 그림: ${word}`);
};
export const handleGameEnded = () => {
  timer.innerText = "";
  setNotif("게임이 끝났습니다.");
  disableCanvas();
  hideControls();
  resetCanvas();
};
export const handleGameStarting = () => {
  setNotif("게임이 곧 시작됩니다!");
};
