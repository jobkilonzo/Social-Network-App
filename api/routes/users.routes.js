import { Router } from "express";
import { getUsers, updateUsers } from "../controllers/users.controllers.js";


const usersRoute = Router()
usersRoute.get('/find/:userId', getUsers)
usersRoute.put('/', updateUsers)

export default usersRoute