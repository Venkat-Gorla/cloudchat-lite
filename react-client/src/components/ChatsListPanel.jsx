import ChatsList from "./ChatsList";

export default function ChatsListPanel() {
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
      <ChatsList />
    </div>
  );
}
