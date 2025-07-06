import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PhonebookProvider } from "./context/PhonebookContext";
import AppRoutes from "./AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <PhonebookProvider>
        <Router>
          <AppRoutes />
        </Router>
      </PhonebookProvider>
    </AuthProvider>
  );
}
