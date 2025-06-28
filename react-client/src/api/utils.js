export function fetchConversationsForDisplay(conversations, userId) {
  return conversations
    .filter((c) => c.UserId === `USER#${userId}`)
    .sort((a, b) => b.LastTimestamp - a.LastTimestamp)
    .map((c) => ({
      id: c.ConversationIndex,
      // vegorla: we should ensure input userId is first in the display name,
      // dynamo table will store them in sorted order
      displayName: c.MessageSortKey.split("#").slice(1).join(" ↔ "),
      lastMessage: c.LastMessage,
      timestamp: c.LastTimestamp,
    }));
}
