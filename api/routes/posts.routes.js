import { Router } from "express";
import { addPosts, getPosts } from "../controllers/posts.controllers.js";

const postRoute = Router()
postRoute.get('/', getPosts)
postRoute.post('/', addPosts)

export default postRoute