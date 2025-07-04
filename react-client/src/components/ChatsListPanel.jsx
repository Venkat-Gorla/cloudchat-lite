import { useState, useEffect, useRef } from "react";
import ChatsList from "./ChatsList";

const dummyUsers = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Daniels",
  "Diana Prince",
  "Edward Norton",
  "Fiona Apple",
];

export default function ChatsListPanel() {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(dummyUsers);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setFilteredUsers(
      dummyUsers.filter((u) => u.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      <div className="px-3 py-2 border-bottom position-relative" ref={inputRef}>
        <h5 className="mb-3">Chats</h5>
        <input
          type="text"
          placeholder="Search or start a new chat"
          className="form-control form-control-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && (
          <ul
            className="list-group position-absolute w-100 shadow-sm mt-1"
            style={{ zIndex: 10 }}
          >
            {filteredUsers.map((user) => (
              <li
                key={user}
                className={`list-group-item list-group-item-action ${
                  selectedUser === user ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedUser(user);
                  setSearch(user);
                  setShowDropdown(false);
                }}
                style={{ cursor: "pointer" }}
              >
                {user}
              </li>
            ))}
            {filteredUsers.length === 0 && (
              <li className="list-group-item text-muted">No users found</li>
            )}
          </ul>
        )}
      </div>

      <ChatsList />
    </div>
  );
}
