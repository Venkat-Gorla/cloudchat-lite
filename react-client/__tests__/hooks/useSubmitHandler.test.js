import { renderHook, act } from "@testing-library/react";
import { useSubmitHandler } from "../../src/hooks/useSubmitHandler";
import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("useSubmitHandler", () => {
  const mockNavigate = vi.fn();
  const mockAction = vi.fn();
  const fakeEvent = { preventDefault: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("does not submit if form is invalid", async () => {
    const { result } = renderHook(() =>
      useSubmitHandler({
        isFormValid: false,
        actionFn: mockAction,
        redirectTo: "/home",
      })
    );

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockAction).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("calls actionFn and navigates when form is valid", async () => {
    mockAction.mockResolvedValue();

    const { result } = renderHook(() =>
      useSubmitHandler({
        isFormValid: true,
        actionFn: mockAction,
        redirectTo: "/home",
      })
    );

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("handles errors in actionFn gracefully", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockAction.mockRejectedValue(new Error("Failure"));

    const { result } = renderHook(() =>
      useSubmitHandler({
        isFormValid: true,
        actionFn: mockAction,
        redirectTo: "/home",
      })
    );

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.isSubmitting).toBe(false);

    errorSpy.mockRestore();
  });
});
