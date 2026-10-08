import "dotenv/config";

const env = {
    database: {
        name: process.env.DB_NAME ?? ""
    }
}