import React from "react";
import LoginForm from "@/components/Navbar/LoginForm";
import SignUpForm from "@/components/Navbar/SignUpForm";
import LandingPageTitle from "@/components/home/LandingPageTitle";
import Navbar from "@/components/Navbar/Navbar";

const AuthPage = () => (
    <div className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
    <div className="flex flex-col bg-[url('/background/Grid.svg')] max-h-1/2 rounded-3xl bg-opacity-[15%]">
            <div  className="px-32">
            <Navbar pageId="userauth" />
            <LandingPageTitle />
            <div className="flex flex-row items-center justify-between">
                <div className="w-1/2 h-full border-r border-gray-300 pr-3">
                    <LoginForm />
                </div>
                <div className="w-1/2 h-full pl-3">
                    <SignUpForm />
                </div>
            </div>
        </div>
        </div>
    </div>
);

export default AuthPage;
