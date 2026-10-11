import express, {Express} from "express";

const app: Express = express();

const PORT = 3000;

app.get("/", (_req, res) => {
    res.json({
        message: "Bienvenue sur l'API de KINESIS",
        status: "Ok"
    });
});

app.get("/api/health", (_req, res) => {
    res.json({
         "message": "L'API KINESIS fonctionne correctement",
         "status": "OK"
    })
});

export default app;