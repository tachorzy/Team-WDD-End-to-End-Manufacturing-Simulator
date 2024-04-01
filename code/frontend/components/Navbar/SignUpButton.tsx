import React from "react";
import Link from "next/link";

const SignUpButton: React.FC = () => (
    <div className="flex flex-row border-2 border-[#C5C9D6] h-7 border-solid rounded-lg text-[#494949] hover:scale-[101.5%] hover:border-MainBlue transition duration-500 ease-in-out   ">
        <Link href="/">
            <h1 className="text-sm font-medium text-[#494949] py-0.5 px-2">
                Sign Up
            </h1>
        </Link>
    </div>
);

export default SignUpButton;
