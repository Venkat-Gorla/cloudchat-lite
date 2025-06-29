import { renderHook, act } from "@testing-library/react";
import useFormFields from "../../src/hooks/useFormFields";

describe("useFormFields", () => {
  it("initializes formData and formValid correctly", () => {
    const { result } = renderHook(() => useFormFields(["name", "email"]));
    expect(result.current.formData).toEqual({ name: "", email: "" });
    expect(result.current.formValid).toEqual({ name: false, email: false });
    expect(result.current.isFormValid).toBe(false);
  });

  it("updates field value and validity", () => {
    const { result } = renderHook(() => useFormFields(["name", "email"]));

    act(() => {
      result.current.handleFieldChange("name", "Alice", true);
    });

    expect(result.current.formData.name).toBe("Alice");
    expect(result.current.formValid.name).toBe(true);
    expect(result.current.isFormValid).toBe(false);

    act(() => {
      result.current.handleFieldChange("email", "alice@example.com", true);
    });

    expect(result.current.formData.email).toBe("alice@example.com");
    expect(result.current.formValid.email).toBe(true);
    expect(result.current.isFormValid).toBe(true);
  });
});
