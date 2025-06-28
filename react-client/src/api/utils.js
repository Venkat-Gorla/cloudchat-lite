export function fetchConversationsForDisplay(conversations, userId) {
  return conversations
    .filter((c) => c.UserId === `USER#${userId}`)
    .sort((a, b) => b.LastTimestamp - a.LastTimestamp)
    .map((c) => ({
      id: c.ConversationIndex,
      displayName: formatDisplayName(c.Participants, userId),
      lastMessage: c.LastMessage,
      timestamp: c.LastTimestamp,
    }));
}

export function formatDisplayName(participants, currentUser) {
  if (!participants.includes(currentUser)) return participants.join(" ↔ ");
  const others = participants.filter((p) => p !== currentUser).sort();
  return [currentUser, ...others].join(" ↔ ");
}
