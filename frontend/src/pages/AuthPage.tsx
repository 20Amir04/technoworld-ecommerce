import { useState } from "react";



const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<"Login" | "Sign Up">("Login");


return (
    <div className="">
        <div className="">
            <div className="">
                <button 
                onClick={() => setActiveTab("Login")} 
                className={`px-6 py-2 font-semibold font-serif ${activeTab === "Login" 
                    ? "border-b-2 border-black text-white" : "text-gray-400 hover:text-black"}`}
                >
                    Login
                </button>
                <button
                onClick={() => setActiveTab("Sign Up")} 
                >

                </button>
            </div>
        </div>
    </div>
);
};
export default AuthPage;