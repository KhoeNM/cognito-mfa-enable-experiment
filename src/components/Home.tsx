import { clearAccessToken, getAccessToken, signOut } from "../authService"

const Home = () => {
    const handleSignOut = async () => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            alert('No access token found. Please sign in first.');
            return;
        }

        try {
            await signOut(accessToken);
            clearAccessToken();
            alert('Signed out successfully.');
            window.location.href = '/signin';
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Failed to sign out. Please try again.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Home</h2>
            <button
                onClick={handleSignOut}
                className="bg-red-500 text-white p-2 rounded"
            >
                Sign Out
            </button>
        </div>
    );
};

export default Home;