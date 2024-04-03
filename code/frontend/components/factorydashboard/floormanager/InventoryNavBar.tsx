import React, { useState } from "react";

const InventoryNavBar = () => {
    const [activeNavItem, setActiveNavItem] = useState("CNC Models");

    const navbarLinks = [
        { label: "CNC Models", link: "" },
        {
            label: "Stamping Models",
            link: "",
        },
        { label: "EDM Models", link: "" },
    ];

    return (
        <div className="flex self-start flex-row gap-x-3">
            {navbarLinks.map((navItem) => (
                <button
                    type="button"
                    onClick={() => setActiveNavItem(navItem.label)}
                    className={`${
                        navItem.label === activeNavItem
                            ? "text-MainBlue"
                            : "text-[#494949]"
                    }  group cursor-pointer font-medium text-xs mt-1.5`}
                >
                    {navItem.label}
                    {navItem.label === activeNavItem ? (
                        <span className="block max-w-0 max-w-full transition-all duration-500 pt-[0.2rem] bg-MainBlue -mb-1.5 z-50 relative" />
                    ) : (
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 pt-[0.2rem] bg-MainBlue -mb-1.5 z-50 relative" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default InventoryNavBar;
