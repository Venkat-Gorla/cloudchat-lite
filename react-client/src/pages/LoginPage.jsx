import { useAuth } from "../context/AuthContext";
import useFormFields from "../hooks/useFormFields";
import { useSubmitHandler } from "../hooks/useSubmitHandler";

export default function LoginPage() {
  const { login } = useAuth();

  const { formData, isFormValid, handleFieldChange } = useFormFields([
    "username",
    "password",
  ]);

  const {
    handleSubmit: handleLogin,
    isSubmitting,
    errorMessage,
  } = useSubmitHandler({
    isFormValid,
    actionFn: login,
    redirectTo: "/chats",
  });

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
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => handleLogin(e, formData)} autoComplete="off">
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
            <label htmlFor="login-pass" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="login-pass"
              name="login-pass"
              className="form-control"
              value={formData.password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
