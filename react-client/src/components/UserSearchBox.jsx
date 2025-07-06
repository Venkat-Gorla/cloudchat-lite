import { useState, useEffect, useRef } from "react";
import { usePhonebook } from "../context/PhonebookContext";

export default function UserSearchBox() {
  const { data: phonebookUsers, isLoading, error } = usePhonebook();
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRef = useRef(null);

  // TODO: - modularize this component, useMemo for performance
  // - username should be part of search and active user logic

  // Update filtered list based on search input
  useEffect(() => {
    if (!phonebookUsers) return;
    const names = phonebookUsers.map((user) => user.name);
    setFilteredUsers(
      names.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, phonebookUsers]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const placeholderText = isLoading
    ? "Loading users..."
    : error
    ? error
    : "Search or start a new chat";

  return (
    <div ref={inputRef}>
      <input
        type="text"
        placeholder={placeholderText}
        className="form-control form-control-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        disabled={isLoading || !!error}
      />

      {showDropdown && (
        <ul
          className="list-group position-absolute w-100 shadow-sm mt-1"
          style={{ zIndex: 10 }}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
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
            ))
          ) : (
            <li className="list-group-item text-muted">No users found</li>
          )}
        </ul>
      )}
    </div>
  );
}
