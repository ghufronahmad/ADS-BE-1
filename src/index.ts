import express from 'express';
import { PrismaClient } from '@prisma/client'
import rootRoutes from './routes'

const app = express();

app.use(express.json())
app.use('/api', rootRoutes)

export const prismaClient = new PrismaClient({
  log: ['query']
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})  