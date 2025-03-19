import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../authContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./login.css";
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar from Material-UI
import Alert from "@mui/material/Alert"; // Import Alert from Material-UI

function Login() {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // For snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // For snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // For snackbar severity (error, success, etc.)

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the snackbar
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      dispatch({ type: "LOGIN_START" });
      const res = await axios.post("http://localhost:7700/api/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

      // Show success message
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Snackbar opened with message:", "Login successful!"); // Debug

      // Redirect to home page after a short delay
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      let errorMessage = "An error occurred while logging in.";
      if (err.response && err.response.data) {
        // Map backend error messages to user-friendly messages
        switch (err.response.data.message) {
          case "User not found!":
            errorMessage = "User not found. Please check your username.";
            break;
          case "Email should be verified":
            errorMessage = "Please verify your email first.";
            break;
          case "Password doesn't match":
            errorMessage = "Password doesn't match.";
            break;
          default:
            errorMessage = err.response.data.message;
        }
      }

      // Show error message
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.log("Snackbar opened with message:", errorMessage); // Debug

      dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data || errorMessage });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="login">
      <Navbar />
      <div className="loginCard">
        <div className="center">
          <h1>Welcome Back!</h1>
          <form>
            <div className="txt_field">
              <input
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
                className="lInput"
              />
            </div>
            <div className="txt_field">
              <input
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
                className="lInput"
              />
            </div>
            <div className="login_button">
              <button className="button" onClick={handleClick} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"} {/* Loading indicator */}
              </button>
            </div>
            <div className="signup_link">
              <p>
                Not registered? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Auto-close after 6 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at top center
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;