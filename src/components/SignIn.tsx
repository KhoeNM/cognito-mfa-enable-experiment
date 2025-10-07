import { useState } from "react";
import { type AuthResponse, signIn, setAccessToken } from "../authService";
import { Link } from "react-router-dom";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const response: AuthResponse = await signIn(username, password);
            const accessToken = response.AuthenticationResult?.AccessToken;
            if (accessToken) {
                setAccessToken(accessToken);
                alert('Sign in successful!');
                window.location.href = '/';
            }
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <input
                type="text"
                placeholder="Username"
                className="border p-2 mb-2 w-full"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 mb-2 w-full"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleSignIn}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Sign In
            </button>
            <p>No account? Please <Link to="/signup">sign up</Link> </p>
        </div>
    )
};

export default SignIn;