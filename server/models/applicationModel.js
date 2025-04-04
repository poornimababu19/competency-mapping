import db from "../config/db.js";

export const applyToJob = (student_id, job_id, callback) => {
  const sql = "INSERT INTO applications (student_id, job_id) VALUES (?, ?)";
  db.query(sql, [student_id, job_id], callback);
};

export const getApplicationsByStudent = (student_id, callback) => {
  const sql = `
    SELECT a.id, j.title, j.description, a.applied_at 
    FROM applications a 
    JOIN jobs j ON a.job_id = j.id 
    WHERE a.student_id = ?
  `;
  db.query(sql, [student_id], callback);
};
