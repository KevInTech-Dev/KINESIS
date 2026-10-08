import express, {Express} from "express";

const app: Express = express();

const PORT = 3000;

app.get("/", (_req, res) => {
    res.json({
        message: "Bienvenue sur l'API de KINESIS",
        status: "Ok"
    });
});

export default app;