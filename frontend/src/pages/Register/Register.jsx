import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./register.css";
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar from Material-UI
import Alert from "@mui/material/Alert"; // Import Alert from Material-UI

function Register() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false); // For loading state
    const [snackbarOpen, setSnackbarOpen] = useState(false); // For snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState(""); // For snackbar message
    const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // For snackbar severity (error, success, etc.)

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false); // Close the snackbar
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            let profilePicture = "";

            if (file) {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", "gymbro");

                const uploadRes = await axios.post(
                    "https://api.cloudinary.com/v1_1/doqyweatx/image/upload",
                    data,
                    { withCredentials: false }
                );

                profilePicture = uploadRes.data.url;
            }

            const newUser = { ...info, profilePicture };

            const res = await axios.post("https://server-seide.vercel.app/api/auth/register", newUser, { withCredentials: true });
            setSnackbarMessage("Confirmation link sent. Please confirm your email."); // Success message
            setSnackbarSeverity("success"); // Set snackbar to success
            setSnackbarOpen(true); // Show snackbar
            navigate("/login"); // Redirect to login after registration
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed. Network error.";
            setSnackbarMessage(errorMessage); // Error message
            setSnackbarSeverity("error"); // Set snackbar to error
            setSnackbarOpen(true); // Show snackbar
            console.error("Registration error:", err.response?.data || err.message);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="register">
            <Navbar />
            <div className="registerCard">
                <div className="center">
                    <h1>Join Us</h1>
                    <form>
                        <div className="image">
                            <img
                                src={
                                    file
                                        ? URL.createObjectURL(file)
                                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                }
                                alt="Profile Preview"
                                height="100px"
                            />
                            <div className="txt_field_img">
                                <label htmlFor="file">Image</label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>

                        <div className="formInput">
                            <div className="txt_field">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    id="username"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="txt_field">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    id="email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="txt_field">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    id="password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="login_button">
                            <button className="button" onClick={handleClick} disabled={isLoading}>
                                {isLoading ? "Registering..." : "Register"} {/* Loading indicator */}
                            </button>
                        </div>
                        <div className="signup_link">
                            <p>
                                Already Registered? <Link to="/login">Login</Link>
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
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position at bottom center
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Register;