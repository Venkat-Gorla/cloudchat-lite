import { fetchConversationsForDisplay } from "./utils.js";

const mockConversationAliceBob = {
  ConversationId: "META#bob",
  MessageSortKey: "CONV#alice#bob",
  UserId: "USER#bob",
  ConversationIndex: "CONV#alice#bob",
  participants: ["alice", "bob"], // <-- New Field, sorted and de-duped
  LastMessage: "Ping me when you’re free.",
  LastTimestamp: 1750930251000,
  Type: "CONV_METADATA",
};

// Mock data matching DynamoDB schema
const mockConversations = [
  // Alice's conversations
  {
    ConversationId: "META#alice",
    MessageSortKey: "CONV#alice#bob",
    UserId: "USER#alice",
    ConversationIndex: "CONV#alice#bob",
    participants: ["alice", "bob"],
    LastMessage: "Hey Bob, can you send the report?",
    LastTimestamp: 1750930051000,
    Type: "CONV_METADATA",
  },
  {
    ConversationId: "META#alice",
    MessageSortKey: "CONV#alice#carol",
    UserId: "USER#alice",
    ConversationIndex: "CONV#alice#carol",
    participants: ["alice", "carol"],
    LastMessage: "Let's catch up tomorrow.",
    LastTimestamp: 1750930151000,
    Type: "CONV_METADATA",
  },

  // Bob's conversations
  {
    ConversationId: "META#bob",
    MessageSortKey: "CONV#bob#dave",
    UserId: "USER#bob",
    ConversationIndex: "CONV#bob#dave",
    participants: ["bob", "dave"],
    LastMessage: "Project deadline is Monday.",
    LastTimestamp: 1750930351000,
    Type: "CONV_METADATA",
  },
  {
    ConversationId: "META#bob",
    MessageSortKey: "CONV#alice#bob",
    UserId: "USER#bob",
    ConversationIndex: "CONV#alice#bob",
    participants: ["alice", "bob"],
    LastMessage: "Ping me when you’re free.",
    LastTimestamp: 1750930251000,
    Type: "CONV_METADATA",
  },

  // Carol's conversation
  {
    ConversationId: "META#carol",
    MessageSortKey: "CONV#alice#carol",
    UserId: "USER#carol",
    ConversationIndex: "CONV#alice#carol",
    participants: ["alice", "carol"],
    LastMessage: "How are you Carol?",
    LastTimestamp: 1750930534328,
    Type: "CONV_METADATA",
  },

  // Dave's conversation
  {
    ConversationId: "META#dave",
    MessageSortKey: "CONV#bob#dave",
    UserId: "USER#dave",
    ConversationIndex: "CONV#bob#dave",
    participants: ["bob", "dave"],
    LastMessage: "See you in the meeting.",
    LastTimestamp: 1750930451000,
    Type: "CONV_METADATA",
  },
];

export function fetchMockConversationsForUser(userId) {
  return fetchConversationsForDisplay(mockConversations, userId);
}
