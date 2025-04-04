import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "competency_mapping",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL connected");
});

export default db;
