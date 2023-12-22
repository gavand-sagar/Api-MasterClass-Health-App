import express from 'express'
import { userRoutes } from './routes/users.js';
import { healthRoutes } from './routes/health.js';
import jwt from 'jsonwebtoken'
const app = express();
app.use(express.json());// to enable json in req.body 


const authMiddleware = async function (req, res, next) {

    try {
        let decodedValue = jwt.verify(req.headers.token, "ABCDEF1234567890");
        req.headers["user"] = decodedValue
        next()
    } catch (error) {
        res.status(403).json({ message: "un authorized" })
    }


}

app.use("/users", userRoutes)
app.use('/health', authMiddleware, healthRoutes)

app.get("/", (req, res) => {
    res.send("Hello its wokring.....")
})


app.listen(3001)