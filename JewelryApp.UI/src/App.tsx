
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className="jewleryApp" data-theme={theme}>
      <AppRoutes />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
