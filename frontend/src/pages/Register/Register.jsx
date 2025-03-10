import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./register.css";

function Register() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState({});

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

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

            await axios.post("http://localhost:7700/api/auth/register", newUser, { withCredentials: true });

            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err.response?.data || err.message);
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
                            <button className="button" onClick={handleClick}>
                                Register
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
        </div>
    );
}

export default Register;
