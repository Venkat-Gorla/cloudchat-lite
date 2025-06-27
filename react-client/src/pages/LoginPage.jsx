import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/chats");
  };

  return (
    <div className="container text-center py-5">
      <h2>Welcome to CloudChat</h2>
      <button className="btn btn-primary mt-3" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
