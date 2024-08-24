import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormBuilder from "./components/FormBuilder";
import PreviewForm from "./components/PreviewForm";

const App = () => {
  const [formConfig, setFormConfig] = useState({ fields: [] });

  const handleSaveForm = (config) => {
    setFormConfig(config);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormBuilder formConfig={formConfig} onSaveForm={handleSaveForm} />} />
        <Route path="/preview" element={<PreviewForm formConfig={formConfig} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
