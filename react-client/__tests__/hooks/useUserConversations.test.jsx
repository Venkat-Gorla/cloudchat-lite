import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useUserConversations from "../../src/hooks/useUserConversations";
import { fetchConversationsForUser } from "../../src/api/conversations";

vi.mock("../../src/api/conversations", () => ({
  fetchConversationsForUser: vi.fn(),
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

  it("fetches conversations when userId is provided", async () => {
    fetchConversationsForUser.mockResolvedValueOnce(["Chat 1", "Chat 2"]);

    const { result } = renderHook(() => useUserConversations("user-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchConversationsForUser).toHaveBeenCalledWith("user-123");
    expect(result.current.data).toEqual(["Chat 1", "Chat 2"]);
  });

  it("does not fetch when userId is falsy", async () => {
    const { result } = renderHook(() => useUserConversations(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();

    expect(fetchConversationsForUser).not.toHaveBeenCalled();
  });

  it("handles API error correctly", async () => {
    fetchConversationsForUser.mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => useUserConversations("error-user"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Fetch failed");
  });
});
