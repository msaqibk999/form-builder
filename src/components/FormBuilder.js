import React, { useState } from "react";
import FormField from "./FormField";
import styles from "./FormBuilder.module.css";
import { useNavigate } from "react-router-dom";

const FormBuilder = ({ formConfig, onSaveForm }) => {
  const [fields, setFields] = useState(formConfig.fields);
  const navigate = useNavigate();
  console.log(fields)

  const addField = () => {
    setFields([
      ...fields,
      {
        id: Date.now(),
        type: "text",
        label: "",
        options: [],
        required: false,
        validations: {},
      },
    ]);
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSave = () => {
    const formConfig = { fields };
    onSaveForm(formConfig);
  };

  const handleUpdateField = (updatedField, index) => {
    console.log("updated field = " + JSON.stringify(updatedField))
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const handlePreview = () => {
    handleSave();
    navigate("/preview");
  };

  const handleSaveFormConfig = () => {
    const formConfig = { fields };
    localStorage.setItem("savedFormConfig", JSON.stringify(formConfig));
    onSaveForm(formConfig);
  };

  const handleLoadFormConfig = () => {
    const savedConfig = JSON.parse(localStorage.getItem("savedFormConfig"));
    if (savedConfig && savedConfig.fields) {
      setFields(savedConfig.fields);
    }
  };

  const handleExportJSON = () => {
    const formConfig = { fields };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(formConfig));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "formConfig.json");
    downloadAnchor.click();
  };

  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const importedConfig = JSON.parse(event.target.result);
      if (importedConfig && importedConfig.fields) {
        setFields(importedConfig.fields);
      }
    };
    fileReader.readAsText(e.target.files[0]);
  };

  const handleImportBtnClick = () => {
    const ele = document.getElementById("import-json");
    ele.click();
  };

  return (
    <div className={styles.formBuilder}>
      <h1>Form Builder</h1>
      <div className={styles.formFieldsContainer}>
        {fields.length > 0 &&
          fields.map((field, index) => (
            <FormField
              key={field.id}
              field={field}
              onRemove={() => removeField(field.id)}
              onUpdateField={(updatedField) => {
                handleUpdateField(updatedField, index);
              }}
            />
          ))}
      </div>
      <section className={styles.btnSection}>
        <button onClick={addField}>Add Field</button>
        <button onClick={handleSaveFormConfig}>Save Form Configuration</button>
        <button onClick={handleLoadFormConfig}>Load Form Configuration</button>
        <button onClick={handleExportJSON}>Export as JSON</button>
        <button onClick={handleImportBtnClick}>Import from JSON</button>
        <input
          id="import-json"
          type="file"
          onChange={handleImportJSON}
          accept=".json"
          style={{ display: "none" }}
        />
        <button onClick={handlePreview} disabled={fields.length === 0}>
          Preview Form
        </button>
      </section>
    </div>
  );
};

export default FormBuilder;
