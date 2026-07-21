
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="jewleryApp">
          <AppRoutes />
          <ToastContainer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
