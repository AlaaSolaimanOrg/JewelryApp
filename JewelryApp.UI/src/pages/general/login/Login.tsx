import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSun, FaMoon } from "react-icons/fa";
import { login } from "../../../apis/login.api/login.api";
import logo from "../../../assets/images/jewelary-logo.svg";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { checkRequestSucceeded, showError } from "../../../utils";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const { userInfo, callGetUserInfo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const redirectAfterLogin = () => {
    if (userInfo?.roles?.includes("PosRole")) {
      navigate("/");
    } else if (userInfo?.roles?.includes("Admin")) {
      navigate("/admin/dashboard");
    } else if (userInfo?.roles?.includes("TerminalRole")) {
      navigate("/admin/inventory/products");
    } else {
      // Default redirect if no roles match
      navigate("/unauthorized");
    }
  };

  useEffect(() => {
    if (userInfo?.roles?.length) {
      redirectAfterLogin();
    }
  }, [userInfo]);

  const callLogin = () => {
    setIsLoading(true);
    const payload = { email: email, password: password };
    login(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          const { accessToken, refreshToken } = response.data;

          if (remember) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
          } else {
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);
          }

          callGetUserInfo();
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      callLogin();
    }
  };

  return (
    <div className="pos-app login-page" data-theme={theme}>
      <button
        type="button"
        className="login-theme-toggle"
        onClick={toggleTheme}
        title="Light / dark mode"
        aria-label="Toggle light and dark mode"
      >
        {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
      </button>

      <div className="login-card">
        <div className="login-brand">
          <img src={logo} alt="Logo" width={22} height={20} />
          <h1>Adi Jewelry POS</h1>
        </div>
        <p className="login-subtitle">Sign in to your account to continue</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                name="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
