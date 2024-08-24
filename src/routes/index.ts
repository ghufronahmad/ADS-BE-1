import { Router } from 'express'
import karyawanRoutes from './karyawan'
import cutiRoutes from './cuti'

const rootRoutes:Router = Router()

rootRoutes.use('/karyawan', karyawanRoutes) 
rootRoutes.use('/cuti', cutiRoutes)

export default rootRoutes