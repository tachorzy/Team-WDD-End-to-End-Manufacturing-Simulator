import { Factory } from "@/app/api/_utils/types";

const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const requestOptions: RequestInit = {
    headers: {
        "Content-Type": "application/json",
    },
};

const updateFactory = async (factoryData: Factory): Promise<Factory> => {
    const response = await fetch(`${BASE_URL}/factories`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(factoryData),
    });

    if (!response.ok) {
        throw new Error(`Failed to update factory: ${response.statusText}`);
    }

    return (await response.json()) as Factory;
};

export { updateFactory };
