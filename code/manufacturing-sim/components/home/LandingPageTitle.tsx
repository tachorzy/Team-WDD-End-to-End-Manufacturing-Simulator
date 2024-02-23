import React from "react";

const LandingPageTitle: React.FC = () => (
    <div className="flex flex-col items-center justify-center mx-auto">
        <h1 className="font-medium text-MainBlue text-lg py-2">Developed by Developers</h1>
        <h1 className="font-semibold bg-gradient-to-br from-DarkGray via-[#555F68] to-DarkGray bg-clip-text text-transparent text-3xl text-center md:text-4xl lg:text-5xl xl:text-6xl pb-4">
            End-to-End
            <br/>
            Manufacturing Simulator
        </h1>

        <h1 className="font-regular text-[#797979] text-xl py-2">We connect your devices to make them smarter.</h1>
    </div>
);

export default LandingPageTitle;
