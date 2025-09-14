import "./login.scss";
import logo from "../../../assets/images/jewelary-logo.svg";

const Login = () => {
  return (
    <div id="login">
      <div className="login-container">
        <div className="logo text-decoration-none">
          <img src={logo} alt="Logo" width={36} height={32} />
          <h1>GoldCraft POS</h1>
        </div>
        <h2>Login</h2>

        <form className="login-form">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Options */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" name="remember" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn btn-secondary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
