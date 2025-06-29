import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useSubmitHandler({ isFormValid, actionFn, redirectTo }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isFormValid || isSubmitting) return;

      setIsSubmitting(true);
      try {
        // TODO: actionFn should check for failure and the error message
        // can be exposed as state that can be used inside the calling component.
        // Navigate should only happen on success.
        await actionFn();
        navigate(redirectTo);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isFormValid, isSubmitting, actionFn, navigate, redirectTo]
  );

  return { handleSubmit, isSubmitting };
}
