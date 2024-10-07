import React, { useEffect, useState } from "react";
import styles from "./PreviewForm.module.css";
import validateFields from "../utils/validations";
import { useNavigate } from "react-router-dom";

const PreviewForm = ({ formConfig }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  // Check if the field should be shown based on conditional logic
  const shouldShowField = (field) => {
    if (!field.conditionalField) return true;

    // Find the field in formConfig whose label matches the conditionalField value
    const conditionalField = formConfig.fields.find(
      (f) => f.label === field.conditionalField
    );

    if (!conditionalField) return false;
    const conditionalValue = formData[conditionalField.id];

    // Show the field only if the conditional field has a value
    return !!conditionalValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, newErrors } = validateFields(formConfig, formData);
    setErrors(newErrors);

    if (isValid) {
      // Create a new object with keys as labels instead of IDs
      const formattedData = Object.keys(formData).reduce((acc, key) => {
        const field = formConfig.fields.find(
          (field) => field.id === Number(key)
        );
        if (field) {
          acc[field.label] = formData[key]; // Map the label to the corresponding value
        }
        return acc;
      }, {});
      setFormData({});
      alert("Form submitted successfully!");
      console.log(formattedData); // Submit form data or send to backend
    }
  };

  // To redirect to homepage in case of no Form Fields
  useEffect(()=>{
    if(formConfig.fields.length === 0) navigate("/")
    // eslint-disable-next-line
  },[])

  return (
    <div className={styles.previewForm}>
      <h3>Preview Form</h3>
      <form onSubmit={handleSubmit}>
        {formConfig.fields.map(
          (field, index) =>
            shouldShowField(field) && (
              <div key={field.id} className={styles.formField}>
                <label>{field.label || `label ${index + 1}`}</label>
                {field.type === "text" && (
                  <input
                    type={
                      field?.validations?.format === "password"
                        ? "password"
                        : field?.validations?.format === "phone"
                        ? "number"
                        : "text"
                    }
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
                {field.type === "dropdown" && (
                  <select
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    <option value="">Select</option>
                    {field.options.map((option, index) => (
                      <option key={index + option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === "checkbox" && (
                  <input
                    type="checkbox"
                    checked={!!formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                  />
                )}
                {field.type === "radio" && (
                  <div className={styles.radioBtnContainer}>
                    {field.options.map((option, index) => (
                      <label key={index + option}>
                        <input
                          type="radio"
                          name={field.id}
                          value={option}
                          checked={formData[field.id] === option}
                          onChange={(e) =>
                            handleChange(field.id, e.target.value)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === "file" && (
                  <input
                    type="file"
                    onChange={(e) => handleChange(field.id, e.target.files)}
                  />
                )}
                {errors[field.id] && (
                  <p className={styles.error}>{errors[field.id]}</p>
                )}
              </div>
            )
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PreviewForm;
