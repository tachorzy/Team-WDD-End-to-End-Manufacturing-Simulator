import { NextPage } from "next";
import { useState } from "react";
import { signIn } from "next-auth/react";

interface Props {}

const SignIn: NextPage = (props): JSX.Element => {
    const [userInfo, setUserInfo] = useState({ email: "", password: "" });
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false,
        });
        console.log(res);
    };

    return (
        <div className="sign-in-form">
            <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <input
                    value={userInfo.email}
                    onChange={({ target }) =>
                        setUserInfo({ ...userInfo, email: target.value })
                    }
                    type="email"
                    placeholder="Email"
                />
                <input
                    value={userInfo.password}
                    onChange={({ target }) =>
                        setUserInfo({ ...userInfo, password: target.value })
                    }
                    type="password"
                    placeholder="Password"
                />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};
