import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../apis/login.api/login.api";
import logo from "../../../assets/images/jewelary-logo.svg";
import { useAuth } from "../../../context/AuthContext";
import { checkRequestSucceeded, showError } from "../../../utils";
import "./login.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { userInfo, callGetUserInfo } = useAuth();
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
    } else if (userInfo?.roles?.includes("StaffManager")) {
      navigate("/admin/staff");
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
    <div id="login">
      <div className="login-container">
        <div className="logo text-decoration-none">
          <img src={logo} alt="Logo" width={36} height={32} />
          <h2>Adi Jewelry POS</h2>
        </div>
        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
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
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button type="submit" className="btn btn-secondary loginButton">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
