import ChatList from "../components/ChatList";

export default function ChatsPage() {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-3 border-end p-0 overflow-auto">
          <ChatList />
        </div>
        <div className="col-9 p-3">
          <h2>Chat Panel</h2>
        </div>
      </div>
    </div>
  );
}
