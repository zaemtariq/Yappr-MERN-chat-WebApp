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



app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors({
    origin:"",
    credentials:true
}))
app.use("/api/auth", route);
app.use("/api/message", messageRoute);

connectMongoDB();
const __dirname = path.resolve();
if(process.env.NODE_ENV =="production")
{
    app.use(express.static(path.join(__dirname,"../FRONTEND/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../FRONTEND","dist","index.html"));
    })
}
const Port = process.env.PORT;
server.listen(Port, () => {
    console.log("Server is running on " + Port);
});
