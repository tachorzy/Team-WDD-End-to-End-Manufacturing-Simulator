import { Factory } from "@/app/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const requestOptions: RequestInit = {
    headers: {
        "Content-Type": "application/json",
    },
};

const getFactory = async (factoryId: string): Promise<Factory> => {
    try {
        const response = await fetch(
            `${BASE_URL}/factories?id=${factoryId}`,
            requestOptions,
        );
        if (!response.ok) {
            throw new Error(
                `Failed to fetch factory with ID ${factoryId}: ${response.statusText}`,
            );
        }
        return (await response.json()) as Factory;
    } catch (error) {
        console.error(`Failed to fetch factory with ID ${factoryId}:`, error);
        throw new Error(`Failed to fetch factory with ID ${factoryId}`);
    }
};

const createFactory = async (newFactory: Factory): Promise<Factory> => {
    try {
        const response = await fetch(`${BASE_URL}/factories`, {
            ...requestOptions,
            method: "POST",
            body: JSON.stringify(newFactory),
        });
        if (!response.ok) {
            throw new Error(
                `Failed to add new factory: ${response.statusText}`,
            );
        }
        return (await response.json()) as Factory;
    } catch (error) {
        console.error("Failed to add new factory:", error);
        throw new Error("Failed to add new factory");
    }
};

const getAllFactories = async (): Promise<Factory[]> => {
    try {
        const response = await fetch(`${BASE_URL}/factories`, requestOptions);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch all factories: ${response.statusText}`,
            );
        }
        return (await response.json()) as Factory[];
    } catch (error) {
        console.error("Failed to fetch all factories: ", error);
        throw new Error("Failed to fetch all factories.");
    }
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

export { getFactory, createFactory, getAllFactories, updateFactory };