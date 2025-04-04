const JobCard = ({ job, onEdit, onDelete, onApply }) => {
    return (
      <div className="border p-4 mb-4 bg-white rounded shadow">
        <h3 className="text-lg font-bold">{job.title}</h3>
        <p>{job.description}</p>
        <div className="mt-2 flex gap-2">
          {onEdit && <button className="text-blue-500" onClick={onEdit}>Edit</button>}
          {onDelete && <button className="text-red-500" onClick={onDelete}>Delete</button>}
          {onApply && <button className="text-green-600" onClick={() => onApply(job.id)}>Apply</button>}
        </div>
      </div>
    );
  };
  
  export default JobCard;
  