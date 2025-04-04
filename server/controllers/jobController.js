import db from "../config/db.js";

// Create Job Profile
export const createJobProfile = (req, res) => {
  const { 
    title, sector, role_responsibilities, vacancies, skills, 
    education_requirements, job_type, location, description, 
    application_deadline, salary 
  } = req.body;
  
  const company_id = req.user.id; // Ensure only authenticated company users can create jobs

  if (!title || !sector || !role_responsibilities || !vacancies || !skills || 
      !education_requirements || !job_type || !location || !description || 
      !application_deadline || !salary) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = `
    INSERT INTO jobs 
    (company_id, title, sector, role_responsibilities, vacancies, skills, education_requirements, job_type, location, description, application_deadline, salary) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    company_id, title, sector, role_responsibilities, vacancies, skills, 
    education_requirements, job_type, location, description, application_deadline, salary
  ], (err, result) => {
    if (err) {
      console.error("Database error in createJobProfile:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ message: "Job created successfully!", jobId: result.insertId });
  });
};

// Get All Jobs (With Pagination & Filters)
export const getJobs = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const jobType = req.query.jobType;
  const location = req.query.location;
  const minSalary = req.query.minSalary ? parseFloat(req.query.minSalary) : null;
  const sector = req.query.sector;
  const sort = req.query.sort || "newest";

  let filterQuery = " WHERE 1=1 ";
  let queryParams = [];

  if (jobType) {
    filterQuery += " AND jobs.job_type = ? ";
    queryParams.push(jobType);
  }

  if (location) {
    filterQuery += " AND jobs.location LIKE ? ";
    queryParams.push(`%${location}%`);
  }

  if (minSalary !== null) {
    filterQuery += " AND jobs.salary >= ? ";
    queryParams.push(minSalary);
  }

  if (sector) {
    filterQuery += " AND jobs.sector LIKE ? ";
    queryParams.push(`%${sector}%`);
  }

  let sortQuery = "ORDER BY jobs.created_at DESC"; // Default: Newest first
  if (sort === "oldest") sortQuery = "ORDER BY jobs.created_at ASC";
  if (sort === "highestSalary") sortQuery = "ORDER BY jobs.salary DESC";
  if (sort === "lowestSalary") sortQuery = "ORDER BY jobs.salary ASC";

  const sql = `
    SELECT jobs.*, users.email AS company_email 
    FROM jobs 
    JOIN users ON jobs.company_id = users.id 
    ${filterQuery}
    ${sortQuery} 
    LIMIT ? OFFSET ?;
  `;

  const countSql = `SELECT COUNT(*) AS total FROM jobs ${filterQuery}`;

  db.query(countSql, queryParams, (err, countResult) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const totalJobs = countResult[0]?.total || 0;
    queryParams.push(limit, offset);

    db.query(sql, queryParams, (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({
        jobs: results || [],
        totalPages: Math.ceil(totalJobs / limit) || 1,
        currentPage: page,
      });
    });
  });
};

// Get Jobs Posted by a Specific Company
export const getCompanyJobs = (req, res) => {
  const company_id = req.user.id;

  const sql = `SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC`;

  db.query(sql, [company_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ jobs: results });
  });
};

// Update Job Profile
export const updateJobProfile = (req, res) => {
  const { 
    title, sector, role_responsibilities, vacancies, skills, 
    education_requirements, job_type, location, description, 
    application_deadline, salary 
  } = req.body;
  
  const jobId = req.params.id;
  const company_id = req.user.id; // Ensure only the job creator can update it

  const sql = `
    UPDATE jobs 
    SET title = ?, sector = ?, role_responsibilities = ?, vacancies = ?, skills = ?, 
        education_requirements = ?, job_type = ?, location = ?, description = ?, 
        application_deadline = ?, salary = ? 
    WHERE id = ? AND company_id = ?`;

  db.query(sql, [
    title, sector, role_responsibilities, vacancies, skills, 
    education_requirements, job_type, location, description, 
    application_deadline, salary, jobId, company_id
  ], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized to update." });
    }

    res.json({ message: "Job updated successfully!" });
  });
};

// Delete Job Profile
export const deleteJobProfile = (req, res) => {
  const jobId = req.params.id;
  const company_id = req.user.id; // Ensure only the job creator can delete it

  const sql = `DELETE FROM jobs WHERE id = ? AND company_id = ?`;

  db.query(sql, [jobId, company_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized to delete." });
    }

    res.json({ message: "Job deleted successfully!" });
  });
};
