import express from "express";
import cors from "cors"
import  authRoutes  from "./routes/authRoutes.js"
import  userRoutes  from "./routes/userRoutes.js"
import  path from "path"
import { fileURLToPath } from "url";

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.get('/', (req, res) => {
    res.send('Hello from server')
}) 

const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
export default app;
