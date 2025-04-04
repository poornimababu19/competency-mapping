const InputField = ({ label, type, name, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded mt-1"
      />
    </div>
  );
  
  export default InputField;
  