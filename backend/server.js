import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import uploadRouter from './routes/uploadRoute.js'
import chatRouter from './routes/chatRoute.js'

dotenv.config()
const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://paper-brain-pi.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json())

app.use(cors())
app.use(express.json())


app.use('/upload', uploadRouter)
app.use('/chat', chatRouter)

app.get('/', (req, res) => {
  console.log("Paper brain backend");
  res.send("Paper brain backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//Export for Vercel or testing
export default app;