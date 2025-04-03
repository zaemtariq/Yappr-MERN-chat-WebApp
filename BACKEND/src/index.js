import express from "express";
import route from "./routes/auth.route.js";
import { messageRoute } from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectMongoDB } from "./libs/mongoConn.lib.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import bodyParser from "body-parser";
import { app,server } from "./libs/socket.js";
import path from "path";
dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", route);
app.use("/api/message", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../FRONTEND", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectMongoDB();
});
