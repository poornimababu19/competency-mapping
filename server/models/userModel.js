import db from "../config/db.js";

export const createUser = (user, callback) => {
  const sql = `
    INSERT INTO users (name, email, password, role, company_name, phone, location, sector, company_website, college_name, stream) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    user.name,
    user.email,
    user.password,
    user.role,
    user.company_name || null,
    user.phone,
    user.location,
    user.sector || null,
    user.company_website || null,
    user.college_name || null,
    user.stream || null
  ], callback);
};

export const getUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};
