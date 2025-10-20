import "./customLoader.scss";

const CustomLoader = ({
  size = "default",
  text = "Loading...",
  showDots = true,
  height = 400,
}) => {
  return (
    <div
      className={`custom-loader ${size === "compact" ? "compact" : ""}`}
      style={{ height }}
    >
      <div className="spinner-container">
        {text && <div className="loading-text">{text}</div>}
        {showDots && (
          <div className="pulse-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomLoader;
