import React, { useState } from "react";

const DynamicForm = () => {
  const [selectedForm, setSelectedForm] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [inputData, setInputData] = useState({});
  const [storedData, setStoredData] = useState({});
  const [editState, setEditState] = useState({ editing: false, formType: "", index: -1 });

  const formConfig = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  const handleFormSelection = (e) => {
    const formChoice = e.target.value;
    setSelectedForm(formChoice);
    setFormFields(formConfig[formChoice]?.fields || []);
    setInputData({});
    setEditState({ editing: false, formType: "", index: -1 });
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFormSubmission = (e) => {
    e.preventDefault();

    if (editState.editing) {
      setStoredData((prev) => {
        const updatedData = { ...prev };
        updatedData[editState.formType][editState.index] = inputData;
        return updatedData;
      });
      setEditState({ editing: false, formType: "", index: -1 });
      alert("Changes saved successfully!");
    } else {
      if (selectedForm) {
        setStoredData((prev) => ({
          ...prev,
          [selectedForm]: [...(prev[selectedForm] || []), inputData],
        }));
        alert("Form submitted successfully!");
      }
    }
    setInputData({});
  };

  const handleDelete = (formType, index) => {
    setStoredData((prev) => {
      const updatedData = [...(prev[formType] || [])];
      updatedData.splice(index, 1);
      return {
        ...prev,
        [formType]: updatedData,
      };
    });
    alert("Entry deleted successfully!");
  };

  const handleEdit = (formType, index) => {
    setEditState({ editing: true, formType, index });
    setSelectedForm(formType);
    setFormFields(formConfig[formType]?.fields || []);
    setInputData(storedData[formType][index]);
  };

  return (
    <div className="dynamic-form-container">
      <h1>Dynamic Form</h1>

      <div className="form-selection">
        <label htmlFor="form-type">Select Form Type:</label>
        <select id="form-type" value={selectedForm} onChange={handleFormSelection}>
          <option value="">-- Select --</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>
      </div>

      {formFields.length > 0 && (
        <form onSubmit={handleFormSubmission}>
          {formFields.map((field, index) => (
            <div className="form-field" key={index}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "dropdown" ? (
                <select
                  id={field.name}
                  value={inputData[field.name] || ""}
                  onChange={(e) => handleInputChange(e, field.name)}
                  required={field.required}
                >
                  <option value="">-- Select --</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  value={inputData[field.name] || ""}
                  onChange={(e) => handleInputChange(e, field.name)}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button type="submit">{editState.editing ? "Save Changes" : "Submit"}</button>
        </form>
      )}

      {Object.keys(storedData).map((type) => {
        if (storedData[type]?.length === 0) return null;
        return (
          <div key={type}>
            <h2>{type} Submissions</h2>
            <table>
              <thead>
                <tr>
                  {formConfig[type]?.fields.map((field) => (
                    <th key={field.name}>{field.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {storedData[type]?.map((entry, index) => (
                  <tr key={index}>
                    {formConfig[type]?.fields.map((field) => (
                      <td key={field.name}>{entry[field.name] || "-"}</td>
                    ))}
                    <td>
                      <button onClick={() => handleEdit(type, index)}>Edit</button>
                      <button onClick={() => handleDelete(type, index)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;