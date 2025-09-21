import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import AppRoutes from "./routes/Routes";

function App() {
  return (
      <div className="jewleryApp">
        <AppRoutes />
        <ToastContainer />
      </div>
  );
}

export default App;
