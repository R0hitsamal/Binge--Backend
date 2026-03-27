import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DbConnection from "./config/db.js";

import userRouter from "./router/user.js";
import videoRouter from "./router/video.js";
import commentRouter from "./router/comment.js";
import watchHistoryRouter from "./router/watchHistory.js";

dotenv.config();

const app = express();

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173", "https://binge-streamming.vercel.app/"],
    credentials: true,
  }),
);

DbConnection();
app.get("/", (req,res)=>{
  res.send("Hello")
})
app.use("/api/auth", userRouter);
app.use("/api/video", videoRouter);
app.use("/api/comments", commentRouter);
app.use("/api/watchHistory", watchHistoryRouter);

app.listen(5000, () => {
  console.log("App is listining to port 5000");
});
