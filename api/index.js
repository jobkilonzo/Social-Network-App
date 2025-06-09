import express from "express";
import authRouter from "./routes/auth.routes.js";
import likesRoute from "./routes/likes.routes.js";
import commentsRoute from "./routes/comments.routes.js";
import postRoute from "./routes/posts.routes.js";
import usersRoute from "./routes/users.routes.js";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from 'multer'
const app = express();

//middlewares
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));              
app.use(cookieParser());      

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file =req.file
  res.status(200).json(file.filename)
})
// routes
app.use("/api/auth", authRouter);
app.use("/api/comments", commentsRoute);
app.use("/api/likes", likesRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
