import { join } from "path";
import express from "express";
import socketIo from "socket.io";

const PORT = 4000;
const app = express();

// view enging 설정
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

// 정적 파일 제공
app.use(express.static(join(__dirname, "static")));

// routing
app.get("/", (req, res) => res.render("home"));

const handleListening = () =>
  console.log(`✅ Server running http://localhost:${PORT}`);

app.listen(PORT, handleListening);
