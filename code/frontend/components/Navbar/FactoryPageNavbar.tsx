import React from "react";
import Image from "next/image";
import Link from "next/link";
import SignUpButton from "./SignUpButton";

interface NavbarProps {
    pageId: string;
    factoryId: string;
}

const FactoryPageNavbar = (props: NavbarProps) => {
    const { pageId } = props;

    const navbarLinks = [
        { label: "Home", link: "/" },
        { label: "Factory Floor", link: `/factorydashboard/${props.factoryId}` },
        { label: "Dashboard", link: `/factorydashboard/${props.factoryId}`},
        { label: "Assets", link: "/" },
        { label: "Anomaly Detection", link: "/" },
    ];

    return (
        <div className="flex flex-col mt-2 border-b-2 border-solid border-[#C5C9D6] px-32 mb-1.5">
            <div className="flex flex-row gap-x-[75%] items-center justify-center">
                <Image
                    src="/branding/TensorIoT-Logo-Black.svg"
                    width={150}
                    height={150}
                    alt="brand"
                    className="select-none mb-2 left-0"
                />
                <div className="flex flex-row gap-x-6">
                    <Link href="/">
                        <h1 className="group text-base font-medium text-[#494949]">
                            Login
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-16 pt-4 bg-MainBlue" />
                        </h1>
                    </Link>
                    <SignUpButton />
                </div>
            </div>
            

            <div className="flex flex-row gap-x-16 mx-0.5">
                {navbarLinks.map((navItem) => (
                    <div key={navItem.label} className="flex flex-row gap-x-1">
                        <Link href={navItem.link}>
                            <h1
                                className={`${
                                    navItem.label === pageId
                                        ? "text-MainBlue"
                                        : "text-[#494949]"
                                } group text-base font-medium -mt-4`}
                            >
                                {navItem.label}
                                {navItem.label !== pageId ? (
                                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 pt-0.5 bg-MainBlue" />
                                )
                                : 
                                (
                                    <span className="block max-w-0 max-w-full transition-all duration-500 h-0.5 pt-0.5 bg-MainBlue" />
                                )
                                
                            }

                            </h1>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FactoryPageNavbar;
