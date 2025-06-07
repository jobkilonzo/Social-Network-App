import { Router } from "express";
import { login, register } from "../controllers/auth.controllers.js";


const authRouter = Router()
authRouter.post("/", register)
authRouter.get("/", login)

export default authRouter