import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Serveur KINESIS démarré sur http://localhost:${PORT}`);
});