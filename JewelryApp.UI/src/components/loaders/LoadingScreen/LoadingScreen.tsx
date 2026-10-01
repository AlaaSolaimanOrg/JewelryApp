import Loader from "../Loader/Loader";
import "./loadingScreen.scss";

const LoadingScreen = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="loadingScreen">
        <Loader size="large" text="Loading..." />
      </div>
    )
  );
};

export default LoadingScreen;
