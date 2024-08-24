import express, { Router } from "express";
import { createCuti, updateCuti,deleteCuti, getAllCuti } from "../controllers/cuti";

const cutiRoutes:Router = Router()
cutiRoutes.post('/', createCuti)
cutiRoutes.put('/:id', updateCuti)
cutiRoutes.delete('/:id', deleteCuti)
cutiRoutes.get('/',getAllCuti)

export default cutiRoutes
