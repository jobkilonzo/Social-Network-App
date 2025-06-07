import { Router } from "express";
import { getComments } from "../controllers/comments.controller.js";


const commentsRoute = Router()

commentsRoute.get("/", getComments)

export default commentsRoute