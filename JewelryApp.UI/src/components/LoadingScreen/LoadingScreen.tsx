import "./loadingScreen.scss";
import { Spinner } from "react-bootstrap";

const LoadingScreen = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="loadingScreen">
        <Spinner animation="border" variant="warning" />
      </div>
    )
  );
};

export default LoadingScreen;
