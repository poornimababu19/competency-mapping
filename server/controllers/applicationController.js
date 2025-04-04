import { applyToJob, getApplicationsByStudent } from "../models/applicationModel.js";

export const apply = (req, res) => {
  const student_id = req.user.id;
  const { jobId } = req.body;

  applyToJob(student_id, jobId, (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ message: "Applied successfully" });
  });
};

export const getMyApplications = (req, res) => {
  const student_id = req.user.id;

  getApplicationsByStudent(student_id, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
};
