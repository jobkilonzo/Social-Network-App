import { Router } from "express";
import { getLikes } from "../controllers/likes.controllers.js";

const likesRoute = Router()
likesRoute.get('/', getLikes)

export default likesRoute