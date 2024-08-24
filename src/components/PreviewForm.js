import React, { useState } from "react";
import styles from "./PreviewForm.module.css";

const PreviewForm = ({ formConfig }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const validateFields = () => {
    let valid = true;
    // Initializing empty error object
    let newErrors = {};

    formConfig.fields.forEach((field) => {
      const value = formData[field.id];
      const { required, validations } = field;

      // Required validation
      if (required && !value) {
        newErrors[field.id] = `${field.label} is required`;
        valid = false;
      }

      // Min/Max length validation
      if (
        value &&
        validations?.minLength &&
        value.length < validations.minLength
      ) {
        newErrors[
          field.id
        ] = `${field.label} must be at least ${validations.minLength} characters`;
        valid = false;
      }
      if (
        value &&
        validations?.maxLength &&
        value.length > validations.maxLength
      ) {
        newErrors[
          field.id
        ] = `${field.label} must be less than ${validations.maxLength} characters`;
        valid = false;
      }

      // Email validation
      if (value && validations?.format === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = "Invalid email format";
          valid = false;
        }
      }

      // Phone number validation
      if (value && validations?.format === "phone") {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors[field.id] = "Invalid phone number format";
          valid = false;
        }
      }

      // Password validation
      if (value && validations?.format === "password") {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(value)) {
          newErrors[field.id] =
            "Password must have minimum eight characters, at least one letter and one number";
          valid = false;
        }
      }

      // File validation (size/type)
      if (field.type === "file" && value) {
        const file = value[0]; // Assuming single file upload
        if (
          validations?.fileType &&
          !validations.fileType.includes(file.type)
        ) {
          newErrors[
            field.id
          ] = `Invalid file type. Allowed: ${validations.fileType.join(", ")}`;
          valid = false;
        }
        if (validations?.maxSize && file.size > validations.maxSize) {
          newErrors[field.id] = `File size exceeds the limit of ${
            validations.maxSize / (1024 * 1024)
          }MB`;
          valid = false;
        }
      }
    });

    setErrors(newErrors);
    return valid;
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
    if (validateFields()) {
      alert("Form submitted successfully!");
      console.log(formData); // Submit form data or send to backend
    }
  };

  return (
    <div className={styles.previewForm}>
      <h3>Preview Form</h3>
      <form onSubmit={handleSubmit}>
        {formConfig.fields.map(
          (field) =>
            shouldShowField(field) && (
              <div key={field.id} className={styles.formField}>
                <label>{field.label}</label>
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
                      <option key={index} value={option}>
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
                  <div>
                    {field.options.map((option, index) => (
                      <label key={index}>
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
