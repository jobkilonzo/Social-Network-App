import { Router } from "express";
import { getLikes, addLike, deleteLike } from "../controllers/likes.controllers.js";

const likesRoute = Router()
likesRoute.get('/', getLikes)
likesRoute.post('/', addLike)
likesRoute.delete('/', deleteLike)

export default likesRoute