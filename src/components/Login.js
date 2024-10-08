import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(""); // For error messages
    const navigate = useNavigate(); // Changed variable name for clarity

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous error messages

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });

            const json = await response.json();
            console.log(json);

            if (json.success) {
                // Save the auth token and redirect
                localStorage.setItem('token', json.authtoken);
                props.showAlert("Logged in Successfully", "success"); // Optional alert
                navigate("/");
            } else {
                setError("Invalid credentials"); // Set error message
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Server error. Please try again later."); // Handle fetch error
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        value={credentials.email}
                        onChange={onChange}
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={credentials.password}
                        onChange={onChange}
                        name="password"
                        id="password"
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default Login;
