import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../apis/login.api/login.api";
import logo from "../../../assets/images/jewelary-logo.svg";
import { checkRequestSucceeded, showError } from "../../../utils";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const redirectAfterLogin = (accessToken) => {
    const decoded: any = jwtDecode(accessToken);

    const roles =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (roles.includes("Admin") || roles.includes("Admin2")) {
      navigate("/admin/dashboard");
    } else if (roles.includes("PosRole")) {
      navigate("/");
    } else {
      // Default redirect if no roles match
      navigate("/unauthorized");
    }
  };
  const callLogin = () => {
    setIsLoading(true);

    const payload = { username: email, password: password };
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

          redirectAfterLogin(accessToken);
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

    const payload = {
      email,
      password,
      remember,
    };
    callLogin();
  };

  return (
    <div id="login">
      <div className="login-container">
        <div className="logo text-decoration-none">
          <img src={logo} alt="Logo" width={36} height={32} />
          <h1>GoldCraft POS</h1>
        </div>
        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
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

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Options */}
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
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
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
