import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useFormFields from "../hooks/useFormFields";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { formData, isFormValid, handleFieldChange } = useFormFields([
    "username",
    "password",
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    navigate("/chats");
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value;
    handleFieldChange("username", val, !!val.trim());
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    handleFieldChange("password", val, !!val.trim());
  };

  return (
    <div className="container py-5 d-flex flex-column align-items-center">
      <h2 className="text-center mb-5">Welcome to CloudChat</h2>
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", minWidth: "320px", maxWidth: "380px" }}
      >
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={formData.username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={formData.password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!isFormValid}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
