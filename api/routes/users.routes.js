import { Router } from "express";
import { getUsers } from "../controllers/users.controllers.js";


const usersRoute = Router()
usersRoute.get('/find/:userId', getUsers)

export default usersRoute