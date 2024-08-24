import express, { Router } from "express";
import { createKaryawan, updateKaryawan,deleteKaryawan, getAllKaryawan } from "../controllers/karyawan";

const karyawanRoutes:Router = Router()
karyawanRoutes.post('/', createKaryawan)
karyawanRoutes.put('/:nomorInduk', updateKaryawan)
karyawanRoutes.delete('/:nomorInduk', deleteKaryawan)
karyawanRoutes.get('/',getAllKaryawan)

export default karyawanRoutes
