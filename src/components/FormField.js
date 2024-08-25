import React, { useState, useEffect, useRef } from "react";
import styles from "./FormField.module.css";

const FormField = ({ field, onRemove, onUpdateField }) => {
  const [label, setLabel] = useState(field.label);
  const [type, setType] = useState(field.type);
  const [options, setOptions] = useState(field.options);
  const [required, setRequired] = useState(field.required);
  const [validations, setValidations] = useState(field.validations || {});
  const [conditionalField, setConditionalField] = useState(
    field.conditionalField || ""
  );

  // Store a reference to the timer for debouncing
  const debounceTimeoutRef = useRef(null);

  // Function to update the field state
  const updateField = () => {
    onUpdateField({
      ...field,
      label,
      type,
      options,
      required,
      validations,
      conditionalField,
    });
  };

  // Function to debounce updates
  const debounceUpdateField = () => {
    // Clear the previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      updateField();
    }, 300); // 300ms debounce
  };

  // Call debounceUpdateField whenever any of these states change
  useEffect(() => {
    debounceUpdateField();

    // Cleanup the timeout when component unmounts
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
    // eslint-disable-next-line
  }, [label, type, options, required, validations, conditionalField]); // Dependencies

  return (
    <div className={styles.formField}>
      <label>
        <span className={styles.labelText}>Label:</span>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Field Label"
        />
      </label>
      <label>
      <span className={styles.labelText}>Type:</span>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
          <option value="dropdown">Dropdown</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
          <option value="file">File</option>
        </select>
      </label>

      {(type === "radio" || type === "dropdown") && (
        <label>
          <span className={styles.labelText}>Options:</span>
          
          <textarea
            value={options.join(",")}
            onChange={(e) => setOptions(e.target.value.split(",").map((val) => val.trim()))}
            placeholder="Comma-separated options"
          />
        </label>
      )}

      <label className={styles.checkboxContainer}>
      <span className={styles.labelText}>Required:</span>
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
      </label>
      
      {/* Min/Max length validations only for the case of Text and Text Area (Other cases will be handled by Validations) */}
      <div className={styles.validations}>
        {(type === "text" || type === "textarea") &&
          validations.format !== "email" &&
          validations.format !== "password" &&
          validations.format !== "phone" && (
            <>
              <label>
              <span className={styles.labelText}>Min Length:</span>
                <input
                  type="number"
                  value={validations.minLength || ""}
                  onChange={(e) => {
                    setValidations({
                      ...validations,
                      minLength: e.target.value,
                    });
                  }}
                />
              </label>

              <label>
              <span className={styles.labelText}>Max Length:</span>
                <input
                  type="number"
                  value={validations.maxLength || ""}
                  onChange={(e) => {
                    setValidations({
                      ...validations,
                      maxLength: e.target.value,
                    });
                  }}
                />
              </label>
            </>
          )}

        {type === "text" && (
          <label>
            <span className={styles.labelText}>Format:</span>
            <select
              value={validations.format || ""}
              onChange={(e) => {
                setValidations({ ...validations, format: e.target.value });
              }}
            >
              <option value="">None</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="phone">Phone</option>
            </select>
          </label>
        )}

        {type === "file" && (
          <>
            <label>
            <span className={styles.labelText}>Allowed Types:</span>
              <input
                type="text"
                placeholder="Comma-separated types"
                value={
                  validations.fileType ? validations.fileType.join(",") : ""
                }
                onChange={(e) => {
                  setValidations({
                    ...validations,
                    fileType: e.target.value.split(",").map((val) => val.trim()),
                  });
                }}
              />
            </label>

            <label>
            <span className={styles.labelText}>Max File Size(MB):</span>
              <input
                type="number"
                value={
                  validations.maxSize ? validations.maxSize / (1024 * 1024) : ""
                }
                onChange={(e) => {
                  setValidations({
                    ...validations,
                    maxSize: e.target.value * 1024 * 1024,
                  });
                }}
              />
            </label>
          </>
        )}
      </div>

      <div className={styles.conditionalLogic}>
        <label>
        <span className={styles.labelText}>Show field if the following field has value:</span>
          <input
            type="text"
            value={conditionalField}
            onChange={(e) => setConditionalField(e.target.value)}
            placeholder="Enter Label of the field"
          />
        </label>
      </div>

      <button className={styles.removeBtn} onClick={onRemove}>
        Remove Field
      </button>
    </div>
  );
};

export default FormField;
