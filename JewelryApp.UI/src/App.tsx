import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="jewleryApp">
        <AppRoutes />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default App;
