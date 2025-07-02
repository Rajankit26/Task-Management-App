import express from "express";
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.get('/', (req, res) => {
    res.send('Hello from server')
}) 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
export default app;
