import { useEffect, useState } from "react";
import axios from "../services/api";
import Button from "../components/Button";

const StudentDashboard = () => {
  const [view, setView] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");

  useEffect(() => {
    if (view === "all") {
      fetchAllJobs();
    } else if (view === "applied") {
      fetchAppliedJobs();
    }
  }, [view, page, sort]);

  const fetchAllJobs = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        sort,
        jobType,
        location,
        minSalary,
      }).toString();

      const res = await axios.get(`/jobs?${queryParams}`);
      if (res.data && res.data.jobs) {
        setJobs(res.data.jobs);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get("/applications/my");
      setAppliedJobs(res.data);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  const applyFilters = () => {
    setPage(1);
    fetchAllJobs();
  };

  const applyToJob = async (jobId) => {
    try {
      await axios.post("/applications/apply", { jobId });
      alert("Application submitted successfully!");
      fetchAppliedJobs();
    } catch (err) {
      console.error("Application error:", err);
      alert("Failed to apply. Please try again.");
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto mt-10">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r p-6">
        <h2 className="text-lg font-semibold mb-6 text-blue-600">Job Search</h2>

        <div className="flex flex-col space-y-4">
          <Button label="View All Jobs" onClick={() => setView("all")} />
          <Button label="View Applied Jobs" onClick={() => setView("applied")} />
        </div>

        {/* Sorting Options */}
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Sort By</h3>
          <select
            className="border p-2 rounded w-full mb-3"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highestSalary">Highest Salary</option>
            <option value="lowestSalary">Lowest Salary</option>
          </select>
        </div>

        {/* Filtering Options */}
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Filter Jobs</h3>

          {/* Job Type Dropdown */}
          <select
            className="border p-2 rounded w-full mb-3"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
          </select>

          {/* Location */}
          <input
            type="text"
            className="border p-2 rounded w-full mb-3"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Min Salary */}
          <input
            type="number"
            className="border p-2 rounded w-full mb-3"
            placeholder="Min Salary"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />

          {/* Apply Filters Button */}
          <Button label="Apply Filters" onClick={applyFilters} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-3/4 bg-white p-4 border rounded">
        <h2 className="text-2xl font-bold mb-4">{view === "all" ? "All Jobs" : "Applied Jobs"}</h2>

        {view === "all" ? (
          <>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="border p-4 mb-4 rounded shadow">
                  <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                  <p className="text-gray-700">{job.description}</p>

                  {/* Additional Job Details */}
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Sector:</strong> {job.sector}</p>
                    <p><strong>Role & Responsibilities:</strong> {job.responsibilities}</p>
                    <p><strong>Vacancies:</strong> {job.vacancies}</p>
                    <p><strong>Required Skills:</strong> {job.skills}</p>
                    <p><strong>Education:</strong> {job.education}</p>
                    <p><strong>Job Type:</strong> {job.jobType}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Application Deadline:</strong> {new Date(job.application_deadline).toLocaleDateString()}</p>
                    <p><strong>Salary:</strong> {job.salary}</p>
                  </div>

                  {/* Apply Button */}
                  <Button label="Apply" onClick={() => applyToJob(job.id)} />
                </div>
              ))
            ) : (
              <p>No jobs available at the moment.</p>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button label="Previous" onClick={() => setPage(page - 1)} disabled={page === 1} />
              <span>Page {page} of {totalPages}</span>
              <Button label="Next" onClick={() => setPage(page + 1)} disabled={page === totalPages} />
            </div>
          </>
        ) : (
          <>
            {appliedJobs.length > 0 ? (
              appliedJobs.map((job) => (
                <div key={job.id} className="border p-4 mb-4 rounded shadow">
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p>{job.description}</p>
                  <p className="text-sm text-gray-600">Applied on: {new Date(job.applied_at).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No applied jobs found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
