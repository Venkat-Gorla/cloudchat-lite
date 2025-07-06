export default function UserDropdownList({ users, selectedUser, onSelect }) {
  return (
    <ul
      className="list-group position-absolute w-100 shadow-sm mt-1"
      style={{ zIndex: 10 }}
    >
      {users.length > 0 ? (
        users.map((user) => (
          <li
            key={user.username} // unique key
            className={`list-group-item list-group-item-action ${
              selectedUser?.username === user.username ? "active" : ""
            }`}
            onClick={() => onSelect(user)}
            style={{ cursor: "pointer" }}
          >
            <div>{user.name}</div>
            <div className="text-muted small">{user.username}</div>
          </li>
        ))
      ) : (
        <li className="list-group-item text-muted">No users found</li>
      )}
    </ul>
  );
}
