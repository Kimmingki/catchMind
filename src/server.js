import { join } from "path";
import express from "express";
import socketIo from "socket.io";
import logger from "morgan";
import socketController from "./socketController";
import events from "./events";

const PORT = 4000;
const app = express();

// view enging 설정
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

// 로그
app.use(logger("dev"));

// 정적 파일 제공
app.use(express.static(join(__dirname, "static")));

// routing
app.get("/", (req, res) =>
  res.render("home", { events: JSON.stringify(events) })
);

const handleListening = () =>
  console.log(`✅ Server running http://localhost:${PORT}`);

const server = app.listen(PORT, handleListening);

const io = socketIo(server);

io.on("connection", (socket) => socketController(socket));
