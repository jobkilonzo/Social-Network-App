import { Router } from "express";
import { getPosts } from "../controllers/posts.controllers.js";

const postRoute = Router()
postRoute.get('/', getPosts)

export default postRoute