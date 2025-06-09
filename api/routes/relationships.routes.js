import { Router } from "express";
import { addRelationships, deleteRelationships, getRelationships } from "../controllers/relationships.controller.js";

const relationshipsRoute = Router()
relationshipsRoute.get('/', getRelationships)
relationshipsRoute.post('/', addRelationships)
relationshipsRoute.delete('/', deleteRelationships)

export default relationshipsRoute