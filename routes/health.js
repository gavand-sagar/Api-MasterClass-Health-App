
import { Router } from "express";
import { body } from "express-validator";
import { getDatabase, validate } from "../lib/util.js";

export const healthRoutes = Router();

healthRoutes.get('/get-my-health-info', async (req, res) => {
    let db = await getDatabase();
    let healthData = await db.collection('health-data').find({ username: req.headers.user.username }).toArray();
    res.json(healthData)
})

healthRoutes.post('/add-my-health-info',
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('age').isNumeric().notEmpty(),
    body('bloodGroup').notEmpty(),
    validate,
    async (req, res) => {
        let body = req.body;
        body["username"] = req.headers.user.username;
        let db = await getDatabase();
        await db.collection('health-data').insertOne(body)
        res.send("Data Added Successfully")
    })

healthRoutes.delete('/delete-my-health-info',
    async (req, res) => {
        let db = await getDatabase();
        await db.collection('health-data')
            .deleteMany({ username: req.headers.user.username });
        res.send("Data Deleted Successfully")
    })


healthRoutes.get('/get-my-remiders', async (req, res) => {
    let db = await getDatabase();
    let healthData = await db.collection('health-reminders')
        .find({ username: req.headers.user.username }).toArray();
    res.json(healthData)
})
