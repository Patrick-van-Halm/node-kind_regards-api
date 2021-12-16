import express from "express";
import {map as router} from "./router.mjs";
import * as routes from "./routes.mjs";
import db from "./database.js";

let app = express();
app.use(express.json())
app.get("/", (req, res) => {
    res.send("Hello World");
});

router(app, routes.default(db));

app.listen(3000, () => {
    console.log("Listening to port 3000");
})