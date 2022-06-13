import { join } from "path";
import express from "express";
import socketIo from "socket.io";
import logger from "morgan";

const PORT = 4000;
const app = express();

// view enging 설정
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

// 정적 파일 제공
app.use(express.static(join(__dirname, "static")));

// 로그
app.use(logger("dev"));

// routing
app.get("/", (req, res) => res.render("home"));

const handleListening = () =>
  console.log(`✅ Server running http://localhost:${PORT}`);

const server = app.listen(PORT, handleListening);

const io = socketIo(server);

io.on("connection", () => console.log("Somebody Connected"));
