// Load .env data
import * as dotenv from "dotenv";
dotenv.config();

// Imports
import express from "express";
import {map as router} from "./router.mjs";
import * as routes from "./routes.mjs";
const db = (await import("./database.js")).conn

// Init app
let app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Init routes
router(app, routes.default(db));

// Listen to 3000
app.listen(3000, () => {
    console.log("Listening to port 3000");
})