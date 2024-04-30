import Link from "next/link";

const LoginForm = () => (
    <div className="flex items-start justify-end h-screen">
        <form className="w-1/2 h-1/2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <input
                className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                type="text"
                placeholder="Email"
            />
            <input
                className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                type="password"
                placeholder="Password"
            />
            <Link href="/">
                <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Log In
                </button>
            </Link>
        </form>
    </div>
);

export default LoginForm;
