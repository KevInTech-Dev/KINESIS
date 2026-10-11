import app from "./app.js";
import {testConnection} from "./database/sequelize.js"
import env from "./config/env.js"

const startServer = async () => {
  const dbConnect = await testConnection();

  if(!dbConnect) {
    console.log("Connexion échouée, le serveur ne va pas démarrer");
    process.exit(1)
  }
  
  app.listen(env.PORT, () => {
     console.log(`Serveur KINESIS démarré sur http://localhost:${env.PORT}`);
  });
}

startServer();
