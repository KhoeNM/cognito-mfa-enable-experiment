import { useEffect, useState } from "react";
import { getAccessToken, setupTOTP, verifyTOTP } from "../authService";
import { QRCodeCanvas } from "qrcode.react";

const SetupMFA = () => {
    const [secretCode, setSecretCode] = useState<string>('');
    const [session, setSession] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const accessToken = getAccessToken();

    useEffect(() => {
        const setupTotp = async () => {
            if (!accessToken) {
                alert('No access token found. Please sign in first.');
                window.location.href = '/signin';
                return;
            }

            try {
                const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
                const email = decodedToken.email || decodedToken['cognito:username'];
                setUsername(email || 'user');

                const { secretCode, session } = await setupTOTP(accessToken);
                console.log('Session when setting up TOTP:', session);
                setSecretCode(secretCode);
                setSession(session);
            } catch (error) {
                console.error('Error setting up TOTP:', error);
                alert('Failed to set up TOTP. Please try again.');
            }
        };

        setupTotp();
    }, [accessToken]);

    const handleVerify = async () => {
        if (!accessToken || !verificationCode) {
            console.log('AccessToken:', accessToken);
            // console.log('Session:', session);
            console.log('VerificationCode:', verificationCode);
            alert('Missing required information for verification. Please try again.');
            return;
        }

        try {
            await verifyTOTP(accessToken, verificationCode, session);
            alert('TOTP setup and verified successfully!');
            window.location.href = '/home';
        } catch (error) {
            console.error('Error verifying TOTP:', error);
            alert('Failed to verify TOTP. Please check the code and try again.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                Setup MFA
            </h2>
            {secretCode && (
                <div>
                    <p>Session when done with set up TOTP: {session}</p>
                    <p>Scan this QR code with your authenticator app:</p>
                    <QRCodeCanvas 
                        value={`otpauth://totp/${username}?secret=${secretCode}`}
                        size={256}
                        bgColor="#ffffff"
                        fgColor="#000000" 
                    />
                    <p>Or type this secret code manually: {secretCode}</p>
                </div>
            )}
            <input 
                type="text" 
                placeholder="Verification Code" 
                className="border p-2 mb-2 w-full" 
                onChange={(e) => setVerificationCode(e.target.value)} 
            />
            <button 
                onClick={handleVerify} 
                className="bg-blue-500 text-white p-2 rounded"
            >
                Verify
            </button>
        </div>
    )
};

export default SetupMFA;