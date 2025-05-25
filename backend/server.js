import app from "./app.js";
import dotenv from "dotenv"
import connectToDb from "./config/db.js";

dotenv.config()
connectToDb().then(
    ()=> {
        app.listen(process.env.PORT, () => {
            console.log(`app is listeningf on port ${process.env.PORT}`)
        })
    }
).catch(
    (error) => {
        console.error(`Failed to connect to db : ${error.message}`)
    }
)