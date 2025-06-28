// vegorla: suggested dynamo schema, should have participants array for every
// metadata row, this will help with UI integration, group chats etc.
const mockConversationAliceBob = {
  ConversationId: "META#bob",
  MessageSortKey: "CONV#alice#bob",
  ConversationIndex: "CONV#alice#bob",
  participants: ["alice", "bob"], // <-- New Field, sorted and de-duped
  LastMessage: "Ping me when you’re free.",
  LastTimestamp: 1750930251000,
  Type: "CONV_METADATA",
  UserId: "USER#bob",
};

// Mock data matching DynamoDB schema
const mockConversations = [
  // Alice's conversations
  {
    ConversationId: "META#alice",
    MessageSortKey: "CONV#alice#bob",
    ConversationIndex: "CONV#alice#bob",
    LastMessage: "Hey Bob, can you send the report?",
    LastTimestamp: 1750930051000,
    Type: "CONV_METADATA",
    UserId: "USER#alice",
  },
  {
    ConversationId: "META#alice",
    MessageSortKey: "CONV#alice#carol",
    ConversationIndex: "CONV#alice#carol",
    LastMessage: "Let's catch up tomorrow.",
    LastTimestamp: 1750930151000,
    Type: "CONV_METADATA",
    UserId: "USER#alice",
  },

  // Bob's conversations
  {
    ConversationId: "META#bob",
    MessageSortKey: "CONV#bob#dave",
    ConversationIndex: "CONV#bob#dave",
    LastMessage: "Project deadline is Monday.",
    LastTimestamp: 1750930351000,
    Type: "CONV_METADATA",
    UserId: "USER#bob",
  },
  {
    ConversationId: "META#bob",
    MessageSortKey: "CONV#alice#bob",
    ConversationIndex: "CONV#alice#bob",
    LastMessage: "Ping me when you’re free.",
    LastTimestamp: 1750930251000,
    Type: "CONV_METADATA",
    UserId: "USER#bob",
  },

  // Carol's conversation
  {
    ConversationId: "META#carol",
    MessageSortKey: "CONV#alice#carol",
    ConversationIndex: "CONV#alice#carol",
    LastMessage: "How are you Carol?",
    LastTimestamp: 1750930534328,
    Type: "CONV_METADATA",
    UserId: "USER#carol",
  },

  // Dave's conversation
  {
    ConversationId: "META#dave",
    MessageSortKey: "CONV#dave#bob",
    ConversationIndex: "CONV#dave#bob",
    LastMessage: "See you in the meeting.",
    LastTimestamp: 1750930451000,
    Type: "CONV_METADATA",
    UserId: "USER#dave",
  },
];

export function fetchMockConversationsForUser(userId) {
  return mockConversations
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
