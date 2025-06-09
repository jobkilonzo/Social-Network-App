import { Router } from "express";
import { addComments, getComments } from "../controllers/comments.controller.js";


const commentsRoute = Router()

commentsRoute.get("/", getComments)
commentsRoute.post("/", addComments)

export default commentsRoute