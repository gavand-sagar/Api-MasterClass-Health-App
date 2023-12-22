import { Router } from "express";
import { body } from "express-validator";
import { getDatabase, validate } from "../lib/util.js";
import jwt from 'jsonwebtoken'
export const userRoutes = Router();

userRoutes.post('/create-a-new-user',
    body("username").notEmpty(),
    body("password").notEmpty(),
    validate,
    async (req, res) => {
        let body = req.body;
        const db = await getDatabase();
        const users = await db.collection("users").find({ username: body.username }).toArray();
        if (users && users.length > 0) {
            res.send("Username already taken")
            return;
        }

        const result = await db.collection("users").insertOne(body);
        res.send("User Created")
    })

userRoutes.get('/get-all-users', async (req, res) => {
    const db = await getDatabase();
    const users = await db.collection("users").find({}).toArray();
    res.json(users)
})

userRoutes.get('/login', async (req, res) => {
    let username = req.headers.username;
    let password = req.headers.password;

    if (username && password) {
        let db = await getDatabase();
        let users = await db.collection('users').find({ username, password }).toArray()
        if (users && users.length > 0) {
            //
            //generate token and send it to user
            let token = jwt.sign({ username, _id: users[0]._id }, "ABCDEF1234567890", { expiresIn: '20m' });

            res.json({ token })

        } else {
            res.status(403).send("Not Authorized")
        }

    } else {
        res.status(403).send("Not Authorized")
    }
})