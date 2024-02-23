import React from "react";
import Image from "next/image";
import Link from "next/link";

const SignUpButton: React.FC = () => {
    return (
        <div className="flex flex-row border-2 border-[#C5C9D6] border-solid rounded-lg text-[#494949] hover:scale-[101.5%] hover:border-MainBlue transition duration-500 ease-in-out   ">
            <Link href={"/"}>
                <h1 className="text-lg font-medium text-[#494949] py-1.5 px-2">{"Sign Up"}</h1>
            </Link>
        </div>
    );
};

export default SignUpButton;
