import { useState } from "react";
import { type AuthResponse, signIn, setAccessToken, checkMfaConfigured, respondToMfaChallenge } from "../authService";
import { Link } from "react-router-dom";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [session, setSession] = useState('');
    const [showMfaChallenge, setShowMfaChallenge] = useState(false);

    const handleSignIn = async () => {
        try {
            const response: AuthResponse = await signIn(username, password);

            if (response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
                setSession(response.Session || '');
                setShowMfaChallenge(true);
                return;
            }

            const accessToken = response.AuthenticationResult?.AccessToken;
            if (accessToken) {
                setAccessToken(accessToken);
                if (await checkMfaConfigured(accessToken)) {
                    window.location.href = '/';
                } else {
                    window.location.href = '/setup-mfa';
                }
                alert("Sign in successful!");
            }
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const handleMfaSubmit = async () => {
        try {
            const response = await respondToMfaChallenge(username, mfaCode, session);
            const accessToken = response.AuthenticationResult?.AccessToken;
            if (accessToken) {
                setAccessToken(accessToken);
                alert('MFA verified successfully!');
                window.location.href = '/';
            }
        } catch (error) {
            console.error("Error verifying MFA:", error);
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

            {showMfaChallenge && (
                <div className="mt-4">
                    <h3>Enter TOTP code</h3>
                    <input 
                        type="text" 
                        placeholder="TOTP Code" 
                        className="border p-2 mb-2 w-full" 
                        onChange={(e) => setMfaCode(e.target.value)}
                    />
                    <button 
                        onClick={handleMfaSubmit}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Submit MFA
                    </button>
                </div>
            )}

            <p>No account? Please <Link to="/signup">sign up</Link> </p>
        </div>
    )
};

export default SignIn;