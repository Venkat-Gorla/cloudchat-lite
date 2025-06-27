import { useState, useEffect } from "react";

// Improvements:
// - Add timestamp (relative: “5 min ago”) next to last message preview
// - Truncate long names/messages with ellipsis text-truncate w-100 d-block
// - Add hover/focus style to improve accessibility
// - chat list should always be sorted dynamically when new messages arrive,
//   it should Not change the current selection though.

// Mock data matching DynamoDB schema
// vegorla: make this function async and move to separate file.
// do we need react query for demo project? Number of conversations will be
// limited to number of users, so not a big deal.
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
    MessageSortKey: "CONV#bob#carol",
    ConversationIndex: "CONV#bob#carol",
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

function fetchConversationsForUser(userId) {
  return mockConversations
    .filter((c) => c.UserId === `USER#${userId}`)
    .sort((a, b) => b.LastTimestamp - a.LastTimestamp)
    .map((c) => ({
      // vegorla: better name for this field?
      name: c.MessageSortKey.split("#").slice(1).join(" ↔ "),
      lastMessage: c.LastMessage,
      timestamp: c.LastTimestamp,
    }));
}

export default function ChatList() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // vegorla: use currently logged-in user, Not alice
    const userConvos = fetchConversationsForUser("alice");
    setChats(userConvos);
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      <div className="px-3 py-2 border-bottom">
        <h5 className="mb-3">Chats</h5>
        <input
          type="text"
          placeholder="Search or start a new chat"
          className="form-control form-control-sm"
        />
      </div>

      <div className="list-group flex-grow-1 overflow-auto rounded-0">
        {chats.map((chat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`list-group-item list-group-item-action ${
              idx === activeIndex ? "active" : ""
            }`}
          >
            <div className="fw-bold">{chat.name}</div>
            <div className="text-muted small text-truncate">
              {chat.lastMessage}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
