import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import uploadRouter from './routes/uploadRoute.js'
import chatRouter from './routes/chatRoute.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use(cors())
app.use(express.json())


app.use('/upload', uploadRouter)
app.use('/chat', chatRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))