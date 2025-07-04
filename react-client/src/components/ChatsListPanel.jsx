import ChatsList from "./ChatsList";
import UserSearchBox from "./UserSearchBox";

export default function ChatsListPanel() {
  return (
    <div className="d-flex flex-column h-100">
      <div className="px-3 py-2 border-bottom position-relative">
        <h5 className="mb-3">Chats</h5>
        <UserSearchBox />
      </div>
      <ChatsList />
    </div>
  );
}
