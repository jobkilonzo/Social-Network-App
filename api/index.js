import express from "express"
import authRouter from "./routes/auth.routes.js"
import likesRoute from "./routes/likes.routes.js"
import commentsRoute from "./routes/comments.routes.js"
import postRoute from "./routes/posts.routes.js"
import usersRoute from "./routes/users.routes.js"

const app = express()

app.use('/api/auth', authRouter)
app.use('/api/comments', commentsRoute)
app.use('/api/likes', likesRoute)
app.use('/api/posts', postRoute)
app.use('/api/users', usersRoute)
app.listen(8800, () => {
    console.log("API working")
})