import React from "react";
import Image from "next/image";

const ErrorMessage = (props: { message: string; icon: string }) => {
    const { message, icon } = props;

    return (
        <span
            id="invalidCoords"
            className="flex flex-row gap-x-0.5 text-red-400 font-semibold text-xs mt-0.5 pl-3"
        >
            <Image
                src={`/icons/error/${icon}`}
                width={25}
                height={25}
                className="select-none"
                alt="error pin"
            />
            <p className="pt-0.5">{message}</p>
        </span>
    );
};

export default ErrorMessage;
