export default function UserDropdownList({ users, selectedUser, onSelect }) {
  return (
    <ul
      className="list-group position-absolute w-100 shadow-sm mt-1"
      style={{ zIndex: 10 }}
    >
      {users.length > 0 ? (
        users.map((user) => (
          <li
            key={user}
            className={`list-group-item list-group-item-action ${
              selectedUser === user ? "active" : ""
            }`}
            onClick={() => onSelect(user)}
            style={{ cursor: "pointer" }}
          >
            {user}
          </li>
        ))
      ) : (
        <li className="list-group-item text-muted">No users found</li>
      )}
    </ul>
  );
}
