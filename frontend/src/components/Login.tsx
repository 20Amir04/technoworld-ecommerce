

function Login() {
    return (
        <form className="space-y-4">
            <input
            type="email"
            placeholder="Email"
            className="border w-full rounded px-3 py-2 font-serif focus: outline-none focus:ring-2 focus:ring-black"
            />

            <input
            type="password"
            placeholder="Password"
            className="border w-full rounded px-3 py-2 font-serif focus: outline-none focus:ring-2 focus:ring-black" 
            />

            <button
            type="button"
            className="bg-black text-white w-full py-2 rounded hover:scale-110 transition-transform duration-200 font-serif"
            >
            Login
            </button>
            <p className="text-sm font-serif text-center">Forgot your password?{" "}
            <span className="text-black underline font-serif hover:text-gray-700 cursor-pointer">Reset</span>
            </p>
        </form>
    );
}
export default Login;