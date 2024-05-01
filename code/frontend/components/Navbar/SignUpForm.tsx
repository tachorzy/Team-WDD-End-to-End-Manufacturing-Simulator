"use client";

import React, { FormEvent, useState } from "react";
// import { useRouter } from "next/router";
import { NextServerConnector } from "@/app/api/_utils/connector";

const SignUpForm = () => {
    // const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    const isStrongPassword = (passwordInput: string): boolean => {
        if (!/^[A-Z]/.test(passwordInput)) {
            alert("Password must start with a capital letter.");
            return false;
        }
        // Check password length
        if (passwordInput.length < 10) {
            alert("Password must be at least 10 characters long.");
            return false;
        }
        // Check for a special character
        if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(passwordInput)) {
            alert("Password must contain at least one special character.");
            return false;
        }
        // Check for a number
        if (!/\d/.test(passwordInput)) {
            alert("Password must contain at least one number.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!isStrongPassword(password)) {
            return;
        }

        if (password !== verifyPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const config = {
                resource: "auth/register",
                payload: {
                    username: email,
                    password,
                },
            };

            // const data = await NextServerConnector.post(config);
            const response = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    username: email,
                    password,
                }),
            });

            const data = await response.json();

            console.log(data);

            if (data.success) {
                // await router.push("/");
            } else {
                console.log("Failed to register");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <div className="flex items-start justify-start h-screen">
            <form
                className="w-1/2 h-1/2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={handleSubmit}
            >
                <input
                    className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-sm text-gray-500 mb-4">
                    Password must be longer than 10 characters and contain a
                    special character.
                </p>
                <input
                    className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                    type="password"
                    placeholder="Verify Password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;
