import { useState, useMemo } from "react";

export default function useFormFields(fieldNames = []) {
  const initialData = fieldNames.reduce(
    (acc, name) => ({ ...acc, [name]: "" }),
    {}
  );
  const initialValidity = fieldNames.reduce(
    (acc, name) => ({ ...acc, [name]: false }),
    {}
  );

  const [formData, setFormData] = useState(initialData);
  const [formValid, setFormValid] = useState(initialValidity);

  const isFormValid = useMemo(
    () => Object.values(formValid).every(Boolean),
    [formValid]
  );

  const handleFieldChange = (field, value, valid) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormValid((prev) => ({ ...prev, [field]: valid }));
  };

  return {
    formData,
    formValid,
    isFormValid,
    handleFieldChange,
  };
}
