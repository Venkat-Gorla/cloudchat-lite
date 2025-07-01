import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useSubmitHandler({ isFormValid, actionFn, redirectTo }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e, formData) => {
      e.preventDefault();
      if (!isFormValid || isSubmitting) return;

      setIsSubmitting(true);
      setErrorMessage("");

      try {
        const result = await actionFn(formData);
        if (result.success) {
          navigate(redirectTo);
        } else {
          setErrorMessage(result.error || "Invalid username or password");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isFormValid, isSubmitting, actionFn, navigate, redirectTo]
  );

  return { handleSubmit, isSubmitting, errorMessage };
}
