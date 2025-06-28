import { formatDisplayName } from "../../src/api/utils.js";
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
