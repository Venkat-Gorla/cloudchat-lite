import { formatDisplayName, formatTimestamp } from "../../src/api/utils.js";
import { fetchMockConversationsForUser } from "../../src/api/mock-conversations.js";

describe("formatDisplayName", () => {
  it("puts current user first and others sorted", () => {
    expect(formatDisplayName(["alice", "bob", "carol"], "bob")).toBe(
      "bob ↔ alice ↔ carol"
    );
    expect(formatDisplayName(["alice", "bob"], "alice")).toBe("alice ↔ bob");
  });

  it("returns single name for self chat", () => {
    expect(formatDisplayName(["alice"], "alice")).toBe("alice");
  });

  it("does not re-order if currentUser not in participants", () => {
    expect(formatDisplayName(["bob", "carol"], "alice")).toBe("bob ↔ carol");
  });
});

describe("fetchMockConversationsForUser", () => {
  it("should return mapped and sorted conversations for dave", () => {
    const result = fetchMockConversationsForUser("dave");
    expect(result).toHaveLength(1);
    expect(result[0].displayName).toBe("dave ↔ bob");
    expect(result[0].id).toBe("CONV#bob#dave");
  });

  it("should return mapped and sorted conversations for bob", () => {
    const result = fetchMockConversationsForUser("bob");
    expect(result).toHaveLength(2);
    expect(result[0].displayName).toBe("bob ↔ dave");
    expect(result[0].id).toBe("CONV#bob#dave");
    expect(result[1].displayName).toBe("bob ↔ alice");
    expect(result[1].id).toBe("CONV#alice#bob");
  });
});

describe("formatTimestamp", () => {
  it("formats known timestamp correctly", () => {
    // Jan 2, 2024, 3:05 PM local time
    const ts = new Date("2024-01-02T15:05:00").getTime();
    const result = formatTimestamp(ts);

    expect(result).toMatch(/01\/02/); // month/day
    expect(result).toMatch(/03:05/); // hour:minute
    expect(result).toMatch(/(AM|PM)/); // 12-hour suffix
  });

  it("formats midnight correctly", () => {
    const ts = new Date("2024-06-01T00:00:00").getTime();
    const result = formatTimestamp(ts);

    expect(result).toMatch(/06\/01/);
    expect(result).toMatch(/12:00/);
    expect(result).toMatch(/AM/);
  });

  it("formats noon correctly", () => {
    const ts = new Date("2024-06-01T12:00:00").getTime();
    const result = formatTimestamp(ts);

    expect(result).toMatch(/06\/01/);
    expect(result).toMatch(/12:00/);
    expect(result).toMatch(/PM/);
  });

  it("handles invalid timestamp gracefully", () => {
    const result = formatTimestamp(NaN);
    expect(result).toBe("Invalid Date");
  });
});
