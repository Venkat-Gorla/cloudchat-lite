import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useUserConversations from "../../src/hooks/useUserConversations";
import { getConversationsForUser } from "../../src/api/conversations";
import { useAuth } from "../../src/context/AuthContext";

vi.mock("../../src/api/conversations", () => ({
  getConversationsForUser: vi.fn(),
}));

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUserConversations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches conversations when authenticated", async () => {
    getConversationsForUser.mockResolvedValueOnce(["Chat 1", "Chat 2"]);

    useAuth.mockReturnValue({
      getAccessToken: () => "mock-token",
      getUserId: () => "user-123",
    });

    const { result } = renderHook(() => useUserConversations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getConversationsForUser).toHaveBeenCalledWith(
      "mock-token",
      "user-123"
    );
    expect(result.current.data).toEqual(["Chat 1", "Chat 2"]);
  });

  it("does not fetch when userId or token is falsy", async () => {
    useAuth.mockReturnValue({
      getAccessToken: () => null,
      getUserId: () => null,
    });

    const { result } = renderHook(() => useUserConversations(), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();

    expect(getConversationsForUser).not.toHaveBeenCalled();
  });

  it("handles API error correctly", async () => {
    getConversationsForUser.mockRejectedValueOnce(
      new Error("Lambda Fetch failed")
    );

    useAuth.mockReturnValue({
      getAccessToken: () => "mock-token",
      getUserId: () => "error-user",
    });

    const { result } = renderHook(() => useUserConversations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Lambda Fetch failed");
  });
});
