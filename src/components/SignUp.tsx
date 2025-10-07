import { useState } from "react";
import { signUp } from "../authService";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            alert('Sign up successful!');
            window.location.href = '/signin'
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <input 
                type="text"
                placeholder="Email"
                className="border p-2 mb-2 w-full"
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input
                type="password" 
                placeholder="Password"
                className="border p-2 mb-2 w-full"
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button 
                onClick={handleSignUp}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Sign Up
            </button>
        </div>
    )
};

export default SignUp;