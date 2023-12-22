import { MongoClient } from "mongodb";
import { ConnectionString } from '../constants.js'
import { validationResult } from "express-validator";

export async function getDatabase() {
    const client = new MongoClient(ConnectionString)
    const connection = await client.connect()
    const db = connection.db("master-sessions")
    return db;
}


export async function validate(req, res, next) {
    const vResult = validationResult(req);
    if (!vResult.isEmpty()) {
        res.json({ errors: vResult.array() });
        return;
    }
    next()
}