import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controllers.js";


const authRouter = Router()
authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)

export default authRouter