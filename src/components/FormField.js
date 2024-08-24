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
  // const debounceTimeoutRef = useRef(null);

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

  // // Function to debounce updates
  // const debounceUpdateField = () => {
  //   // Clear the previous timeout
  //   if (debounceTimeoutRef.current) {
  //     clearTimeout(debounceTimeoutRef.current);
  //   }

  //   // Set a new timeout
  //   debounceTimeoutRef.current = setTimeout(() => {
  //     updateField();
  //   }, 300); // 300ms debounce
  // };

  // Call debounceUpdateField whenever any of these states change
  useEffect(() => {
    console.log("required = " + required)
    // debounceUpdateField();
    updateField();

    // Cleanup the timeout when component unmounts
    // return () => {
    //   if (debounceTimeoutRef.current) {
    //     clearTimeout(debounceTimeoutRef.current);
    //   }
    // };
  }, [label, type, options, required, validations, conditionalField]); // Dependencies

  const handleRequiredChange = (e) => {
    console.log("checkbox = " + e.target.checked)
    setRequired(e.target.checked);
    
  }


  return (
    <div className={styles.formField}>
      <label>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Field Label"
        />
      </label>
      <label>
        Type:
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
          <option value="dropdown">Dropdown</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
          <option value="file">File</option>
        </select>
      </label>

      {type === "dropdown" && (
        <label>
          Options:
          <textarea
            value={options.join(",")}
            onChange={(e) => setOptions(e.target.value.split(","))}
            placeholder="Comma-separated options"
          />
        </label>
      )}

      <label className={styles.checkboxContainer}>
        Required
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => handleRequiredChange(e)}
        />
      </label>

      <div className={styles.validations}>
        {(type === "text" || type === "textarea") &&
          validations.format !== "email" &&
          validations.format !== "password" &&
          validations.format !== "phone" && (
            <>
              <label>
                Min Length:
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
                Max Length:
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
            Format:
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
              Allowed Types:
              <input
                type="text"
                placeholder="Comma-separated types"
                value={
                  validations.fileType ? validations.fileType.join(",") : ""
                }
                onChange={(e) => {
                  setValidations({
                    ...validations,
                    fileType: e.target.value.split(","),
                  });
                }}
              />
            </label>

            <label>
              Max File Size (MB):
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
          Show field if the following field has value:
          <input
            type="text"
            value={conditionalField}
            onChange={(e) => setConditionalField(e.target.value)}
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
