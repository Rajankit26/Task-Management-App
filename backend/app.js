import express from "express";
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.get('/', (req, res) => {
    res.send('Hello from server')
}) 

app.use('/api/auth', authRoutes);
app.use('api/users', userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

export default app;
