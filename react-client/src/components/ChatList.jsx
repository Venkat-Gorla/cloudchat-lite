export default function ChatList() {
  const chats = [
    { name: "Active chat", active: true },
    { name: "Angel One" },
    { name: "Uber Support" },
    { name: "Paytm" },
  ];

  return (
    <div className="list-group rounded-0">
      {chats.map((chat, idx) => (
        <button
          key={idx}
          className={`list-group-item list-group-item-action ${
            chat.active ? "active" : ""
          }`}
        >
          {chat.name}
        </button>
      ))}
    </div>
  );
}
