import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import { API_BASE_URL } from "../../constants";

function Login({onLoginSuccess}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Navigate to signup page
  const gotoSignup = () => navigate("/signup");

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Handle missing token or invalid response structure
      if (!data?.data?.token) {
        throw new Error("Token not found in response");
      }

      // Store token in local storage
      const token = data.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("loggedIn", "true");
      onLoginSuccess(); 

      // Decode token
      const decodedToken = jwtDecode(token);
      if (!decodedToken?.role || !decodedToken?.user) {
        throw new Error("Invalid token structure");
      }

      // Store user info
      localStorage.setItem("role", decodedToken.role);
      localStorage.setItem("user", decodedToken.user.name);
      localStorage.setItem("email", decodedToken.user.email);

      // Redirect based on role
      navigate(decodedToken.role === "admin" ? "/adminpage" : "/Mainpage", { replace: true });

    } catch (error) {
      // Handle error gracefully
      setError(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Auth-container">
      <img src="/assets/logo.png" className="imagecont" alt="Logo" />

      <form onSubmit={handleLogin} className="Auth-form">
        <h1>Login</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="Auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button type="button" onClick={gotoSignup} className="toggle-button">
          Don't have an account? Register here
        </button>
      </form>
    </div>
  );
}

export default Login;
