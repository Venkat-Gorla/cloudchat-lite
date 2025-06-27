import { useState, useEffect } from "react";

// Improvements:
// - Add timestamp (relative: “5 min ago”) next to last message preview
// - Truncate long names/messages with ellipsis text-truncate w-100 d-block
// - Add hover/focus style to improve accessibility
// - chat list should always be sorted dynamically when new messages arrive,
//   it should Not change the current selection though.

// vegorla:
// - do we need react query for demo project? Number of conversations will be
//   limited to number of users, so not a big deal.
// - spinning circle while we fetch conversations 

import { fetchConversationsForUser } from "../api/conversations.js";

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
            <div className="fw-bold">{chat.displayName}</div>
            <div className="text-muted small text-truncate">
              {chat.lastMessage}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
