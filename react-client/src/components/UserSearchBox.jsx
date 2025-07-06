import { useState, useEffect, useRef } from "react";
import { usePhonebook } from "../context/PhonebookContext";
import UserDropdownList from "./UserDropdownList";

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
        <UserDropdownList
          users={filteredUsers}
          selectedUser={selectedUser}
          onSelect={(user) => {
            setSelectedUser(user);
            setSearch(user);
            setShowDropdown(false);
          }}
        />
      )}
    </div>
  );
}
