import React from "react";
import Image from "next/image";
import Link from "next/link";

const SignUpButton: React.FC = () => {
    return (
        <div className="flex flex-row border-2 border-[#C5C9D6] border-solid rounded-lg text-[#494949]">
            <Link href={"/"}>
                <h1 className="text-lg font-medium text-[#494949] p-1.5">{"Sign Up"}</h1>
            </Link>
        </div>
    );
};

export default SignUpButton;
