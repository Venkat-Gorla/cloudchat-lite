// vegorla: Improvements:
// - chat list should always be sorted dynamically when new messages arrive,
//   it should Not change the current selection though.
// const sortedChats = [...chats].sort((a, b) => b.timestamp - a.timestamp);
// Consider collapsing loading/error/empty states into a common <ChatListState /> component
// Store activeChatId instead of index to preserve selection on reordering

import { useState } from "react";
import useUserConversations from "../hooks/useUserConversations";

export default function ChatsList() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    data: chats = [],
    isLoading,
    isError,
    error,
  } = useUserConversations();

  return (
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
          {error?.message || "Failed to load conversations."}
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
            <div className="d-flex justify-content-between align-items-center">
              <div className="fw-bold text-truncate me-2">
                {chat.displayName}
              </div>
              <div className="text-muted small text-nowrap">
                {chat.displayTimestamp}
              </div>
            </div>
            <div className="text-muted small">{chat.lastMessage}</div>
          </button>
        ))}
    </div>
  );
}
