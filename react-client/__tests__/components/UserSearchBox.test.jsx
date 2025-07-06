import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserSearchBox from "../../src/components/UserSearchBox";

vi.mock("../../src/context/PhonebookContext", () => {
  return {
    usePhonebook: () => ({
      data: [
        { name: "Alice Johnson", username: "alice123" },
        { name: "Bob Smith", username: "bob_smith" },
        { name: "Charlie Brown", username: "charlie" },
      ],
      isLoading: false,
      error: null,
    }),
  };
});

describe("UserSearchBox", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders input with correct placeholder", () => {
    render(<UserSearchBox />);
    expect(screen.getByTestId("user-search-input")).toBeInTheDocument();
    expect(screen.getByTestId("user-search-input").placeholder).toMatch(
      /search or start/i
    );
  });

  it("displays matching users based on search input (case-insensitive)", async () => {
    render(<UserSearchBox />);
    const input = screen.getByTestId("user-search-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "char" } });

    await waitFor(() => {
      expect(screen.getByTestId("user-item-charlie")).toBeInTheDocument();
    });
  });

  it("shows 'No users found' when there is no match", async () => {
    render(<UserSearchBox />);
    const input = screen.getByTestId("user-search-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "zzzzz" } });

    await waitFor(() => {
      expect(screen.getByTestId("user-item-empty")).toBeInTheDocument();
    });
  });

  it("updates input and closes dropdown on user select", async () => {
    render(<UserSearchBox />);
    const input = screen.getByTestId("user-search-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "bob" } });

    const listItem = await screen.findByTestId("user-item-bob_smith");
    fireEvent.click(listItem);

    expect(input.value).toBe("Bob Smith");
    await waitFor(() => {
      expect(
        screen.queryByTestId("user-dropdown-list")
      ).not.toBeInTheDocument();
    });
  });

  it("shows full dropdown when input focused and empty", async () => {
    render(<UserSearchBox />);
    const input = screen.getByTestId("user-search-input");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId("user-dropdown-list")).toBeInTheDocument();
      expect(screen.getByTestId("user-item-alice123")).toBeInTheDocument();
      expect(screen.getByTestId("user-item-bob_smith")).toBeInTheDocument();
      expect(screen.getByTestId("user-item-charlie")).toBeInTheDocument();
    });
  });
});
