import React, { useCallback, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormBuilder from "./components/FormBuilder";
import PreviewForm from "./components/PreviewForm";
import Error from "./components/Error";
import Header from "./components/Header";


const App = () => {
  const [formConfig, setFormConfig] = useState({ fields: [] });

  // Wrap handleSaveForm in useCallback to prevent re-creation on every render
  const handleSaveForm = useCallback((config) => {
    setFormConfig(config);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<FormBuilder formConfig={formConfig} onSaveForm={handleSaveForm} />} />
        <Route path="/preview" element={<PreviewForm formConfig={formConfig} />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
