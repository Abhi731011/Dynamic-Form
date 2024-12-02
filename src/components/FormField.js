import React from "react";

const FormField = ({ field, value, onChange }) => {
  const handleFieldChange = (e) => {
    onChange(field.name, e.target.value);
  };

  switch (field.type) {
    case "dropdown":
      return (
        <div>
          <label>{field.label}</label>
          <select value={value} onChange={handleFieldChange}>
            <option value="">-- Select --</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    default:
      return (
        <div>
          <label>{field.label}</label>
          <input
            type={field.type}
            value={value}
            onChange={handleFieldChange}
            required={field.required}
          />
        </div>
      );
  }
};

export default FormField;
