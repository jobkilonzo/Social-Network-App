import { Router } from "express";
import { addPosts, getPosts, deletePosts } from "../controllers/posts.controllers.js";

const postRoute = Router()
postRoute.get('/', getPosts)
postRoute.post('/', addPosts)
postRoute.delete('/:id', deletePosts)

export default postRoute