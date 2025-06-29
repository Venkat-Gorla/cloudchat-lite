// vegorla: Improvements:
// - Add timestamp (relative: “5 min ago”) next to last message preview
// - Truncate long names/messages with ellipsis text-truncate w-100 d-block
// - Add hover/focus style to improve accessibility
// - chat list should always be sorted dynamically when new messages arrive,
//   it should Not change the current selection though.
// const sortedChats = [...chats].sort((a, b) => b.timestamp - a.timestamp);
// Consider collapsing loading/error/empty states into a common <ChatListState /> component

import { useState } from "react";
import useUserConversations from "../hooks/useUserConversations";

export default function ChatList() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    data: chats = [],
    isLoading,
    isError,
  } = useUserConversations("alice"); // vegorla: Replace with real user

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
        {isLoading && (
          <div className="text-center py-3">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center text-secondary py-3">
            Failed to load conversations.
          </div>
        )}

        {!isLoading && !isError && chats.length === 0 && (
          <div className="text-center text-muted py-3">
            No conversations found.
          </div>
        )}

        {!isLoading &&
          chats.length > 0 &&
          chats.map((chat, idx) => (
            <button
              key={chat.id}
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
