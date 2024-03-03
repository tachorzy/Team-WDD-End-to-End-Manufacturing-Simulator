import React from "react";
import Image from "next/image";
import Sidebar from "./Sidebar.client";

const HamburgerMenu: React.FC = () => (
    <div className="flex flex-row gap-x-[82%] mt-2">
        <Image
            src="/branding/TensorIoT-Logo-Black.svg"
            width={150}
            height={150}
            alt="brand"
            className="select-none my-4"
        />
        <Sidebar />
    </div>
);
export default HamburgerMenu;
