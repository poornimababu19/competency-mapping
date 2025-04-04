import db from "../config/db.js";

export const createJob = (job, callback) => {
  const sql = `
    INSERT INTO jobs 
    (company_id, title, sector, role_responsibilities, vacancies, skills, education_requirements, job_type, location, description, application_deadline, salary) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    job.company_id,
    job.title,
    job.sector,
    job.role_responsibilities,
    job.vacancies,
    job.skills,
    job.education_requirements,
    job.job_type,
    job.location,
    job.description,
    job.application_deadline,
    job.salary
  ], callback);
};

export const getPaginatedJobs = (limit, offset, orderBy, callback) => {
  let orderColumn = "created_at"; 
  let orderDirection = "DESC"; 

  if (orderBy === "oldest") {
    orderDirection = "ASC";
  } else if (orderBy === "title_asc") {
    orderColumn = "title";
    orderDirection = "ASC";
  } else if (orderBy === "title_desc") {
    orderColumn = "title";
    orderDirection = "DESC";
  } else if (orderBy === "highestSalary") {
    orderColumn = "salary";
    orderDirection = "DESC";
  } else if (orderBy === "lowestSalary") {
    orderColumn = "salary";
    orderDirection = "ASC";
  }

  const sql = `
    SELECT jobs.*, users.email AS company_email 
    FROM jobs 
    JOIN users ON jobs.company_id = users.id 
    ORDER BY ${orderColumn} ${orderDirection}
    LIMIT ? OFFSET ?;
  `;

  const countSql = "SELECT COUNT(*) AS total FROM jobs";

  db.query(countSql, (err, countResult) => {
    if (err) return callback(err, null, null);

    const totalJobs = countResult[0].total;

    db.query(sql, [limit, offset], (err, results) => {
      if (err) return callback(err, null, null);
      callback(null, results, totalJobs);
    });
  });
};

export const getJobsByCompany = (company_id, callback) => {
  const sql = "SELECT * FROM jobs WHERE company_id = ?";
  db.query(sql, [company_id], callback);
};

export const updateJob = (job, callback) => {
  const sql = `
    UPDATE jobs 
    SET title = ?, sector = ?, role_responsibilities = ?, vacancies = ?, skills = ?, education_requirements = ?, job_type = ?, location = ?, description = ?, application_deadline = ?, salary = ? 
    WHERE id = ? AND company_id = ?`;

  db.query(sql, [
    job.title,
    job.sector,
    job.role_responsibilities,
    job.vacancies,
    job.skills,
    job.education_requirements,
    job.job_type,
    job.location,
    job.description,
    job.application_deadline,
    job.salary,
    job.job_id,
    job.company_id
  ], callback);
};

export const deleteJob = (job_id, callback) => {
  const sql = "DELETE FROM jobs WHERE id = ?";
  db.query(sql, [job_id], callback);
};
