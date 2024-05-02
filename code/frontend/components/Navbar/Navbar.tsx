import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
    pageId: string;
}

const Navbar = (props: NavbarProps) => {
    const { pageId } = props;

    const navbarLinks = [
        { label: "Home", link: "/" },
        { label: "Gateways", link: "/" },
        { label: "Assets", link: "/" },
    ];

    return (
        <div className="flex flex-row items-center justify-center gap-x-[15%] xl:gap-x-[17.5%] mx-24 mt-2">
            <Image
                src="/branding/TensorIoT-Logo-Black.svg"
                width={150}
                height={150}
                alt="brand"
                className="select-none my-4"
            />
            <div className="flex flex-row gap-x-16 items-center justify-center">
                {navbarLinks.map((navItem) => (
                    <div key={navItem.label} className="flex flex-row gap-x-1">
                        <Link href={navItem.link}>
                            <h1
                                className={`${
                                    navItem.label === pageId
                                        ? "text-MainBlue"
                                        : "text-[#494949]"
                                } group text-lg font-medium`}
                            >
                                {navItem.label}
                                {navItem.label !== pageId && (
                                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-MainBlue" />
                                )}
                            </h1>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="flex flex-row gap-x-6 items-center justify-center">
                <Link href="/userauth">
                    <h1 className="group text-lg font-medium text-[#494949] cursor-pointer">
                        Login / Sign Up
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-MainBlue" />
                    </h1>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
