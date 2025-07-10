export function fetchConversationsForDisplay(conversations, userId) {
  const filtered = conversations.filter((c) => c.UserId === `USER#${userId}`);
  return formatConversationsForDisplay(filtered, userId);
}

export function formatConversationsForDisplay(conversations, userId) {
  return conversations
    .sort((a, b) => b.LastTimestamp - a.LastTimestamp)
    .map((c) => ({
      id: c.ConversationIndex,
      displayName: formatDisplayName(c.Participants, userId),
      lastMessage: c.LastMessage,
      sortTimestamp: c.LastTimestamp,
      displayTimestamp: formatTimestamp(c.LastTimestamp),
    }));
}

export function formatDisplayName(participants, currentUser) {
  if (!participants.includes(currentUser)) return participants.join(" ↔ ");
  const others = participants.filter((p) => p !== currentUser).sort();
  return [currentUser, ...others].join(" ↔ ");
}

export function formatTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
