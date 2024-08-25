const validateFields = (formConfig, formData) => {
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
      value.trim().length < validations.minLength
    ) {
      newErrors[
        field.id
      ] = `${field.label} must be at least ${validations.minLength} characters`;
      valid = false;
    }
    if (
      value &&
      validations?.maxLength &&
      value.trim().length > validations.maxLength
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
      if (validations?.fileType && !validations.fileType.includes(file.type)) {
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

  return { isValid: valid, newErrors: newErrors };
};

export default validateFields;
