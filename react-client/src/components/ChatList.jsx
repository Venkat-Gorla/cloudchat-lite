export default function ChatList() {
  const chats = [
    { name: "Active chat", active: true },
    { name: "Angel One" },
    { name: "Uber Support" },
    { name: "Paytm" },
  ];

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
            className={`list-group-item list-group-item-action ${
              idx === 0 ? "active" : ""
            }`}
          >
            {chat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
