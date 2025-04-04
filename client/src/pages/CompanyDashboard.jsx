import { useEffect, useState } from "react";
import axios from "../services/api";
import InputField from "../components/InputField";
import Button from "../components/Button";

const CompanyDashboard = () => {
  const [view, setView] = useState("create"); // "create" or "view"
  const [jobs, setJobs] = useState([]); // Stores job profiles
  const [editJobId, setEditJobId] = useState(null); // Edit job ID
  const [jobCreated, setJobCreated] = useState(false); // Success message

  // Default job structure
  const defaultJob = {
    title: "",
    description: "",
    sector: "",
    role_responsibilities: "",
    vacancies: 1,
    skills: "",
    education_requirements: "",
    job_type: "Full-time",
    application_deadline: "",
    salary: "",
    location: "",
  };

  const [newJob, setNewJob] = useState(defaultJob);

  useEffect(() => {
    if (view === "view") {
      fetchJobs();
    }
  }, [view]);

  // Fetch jobs created by the company
  const fetchJobs = async () => {
    try {
      const res = await axios.get("/jobs/company");
      setJobs(res.data.jobs); // Ensure we get jobs array
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  // Create or Update Job Profile
  const handleCreateOrUpdate = async () => {
    try {
      const formattedDate = newJob.application_deadline.split("T")[0]; // Convert to YYYY-MM-DD

      // Convert numerical fields to ensure proper data types
      const jobData = {
        ...newJob,
        vacancies: Number(newJob.vacancies),
        salary: Number(newJob.salary),
        application_deadline: formattedDate, // ✅ Fix date format
      };

      console.log("Sending job data:", jobData);

      if (editJobId) {
        await axios.put(`/jobs/${editJobId}`, jobData);
      } else {
        await axios.post("/jobs", jobData);
      }

      // Reset form & fetch jobs
      setNewJob(defaultJob);
      setEditJobId(null);
      setJobCreated(true);
      fetchJobs();
    } catch (err) {
      console.error("Failed to save job", err);
      console.log("Error response:", err.response?.data);
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  // Handle Edit Job
  const handleEdit = (job) => {
    setNewJob({
      ...job,
      application_deadline: job.application_deadline.split("T")[0], // Fix date format when editing
    });
    setEditJobId(job.id);
    setView("create");
  };

  // Handle Delete Job
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto mt-10">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r p-6">
        <h2 className="text-lg font-semibold mb-6 text-blue-600">Create & Manage Jobs</h2>
        <div className="flex flex-col space-y-4">
          <Button label="Create Job Profile" onClick={() => setView("create")} />
          <Button label="View Job Profile" onClick={() => setView("view")} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-3/4 bg-white p-4 border rounded">
        {view === "create" ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{editJobId ? "Edit Job" : "Create Job"}</h2>

            <InputField label="Job Title" type="text" name="title" value={newJob.title} onChange={handleChange} />
            <InputField label="Description" type="text" name="description" value={newJob.description} onChange={handleChange} />
            <InputField label="Sector" type="text" name="sector" value={newJob.sector} onChange={handleChange} />
            <InputField label="Role & Responsibilities" type="text" name="role_responsibilities" value={newJob.role_responsibilities} onChange={handleChange} />
            <InputField label="Vacancies" type="number" name="vacancies" value={newJob.vacancies} onChange={handleChange} />
            <InputField label="Skills" type="text" name="skills" value={newJob.skills} onChange={handleChange} />
            <InputField label="Education Requirements" type="text" name="education_requirements" value={newJob.education_requirements} onChange={handleChange} />

            {/* Job Type Dropdown */}
            <label className="block text-gray-700 font-medium mb-1">Job Type</label>
            <select
              name="job_type"
              value={newJob.job_type}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>

            <InputField label="Application Deadline" type="date" name="application_deadline" value={newJob.application_deadline} onChange={handleChange} />
            <InputField label="Salary" type="number" name="salary" value={newJob.salary} onChange={handleChange} />
            <InputField label="Location" type="text" name="location" value={newJob.location} onChange={handleChange} />

            <Button label={editJobId ? "Update Job" : "Create Job"} onClick={handleCreateOrUpdate} />

            {/* Success Message */}
            {jobCreated && (
              <div className="mt-4 text-green-600">
                <p>Your job profile has been created successfully!</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Your Job Profiles</h2>
            {jobs.length === 0 ? (
              <p>No job profiles available.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="border p-4 mb-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p>{job.description}</p>
                  <p><strong>Sector:</strong> {job.sector}</p>
                  <p><strong>Responsibilities:</strong> {job.role_responsibilities}</p>
                  <p><strong>Vacancies:</strong> {job.vacancies}</p>
                  <p><strong>Skills:</strong> {job.skills}</p>
                  <p><strong>Education:</strong> {job.education_requirements}</p>
                  <p><strong>Type:</strong> {job.job_type}</p>
                  <p><strong>Deadline:</strong> {job.application_deadline}</p>
                  <p><strong>Salary:</strong> ${job.salary}</p>
                  <p><strong>Location:</strong> {job.location}</p>

                  <div className="mt-2 flex gap-2">
                    <Button label="Edit" onClick={() => handleEdit(job)} />
                    <Button label="Delete" onClick={() => handleDelete(job.id)} />
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
