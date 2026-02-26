import mysql from "mysql2/promise";
import "dotenv/config";

export const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
    ssl: {
        rejectUnauthorized: false
    }
});
