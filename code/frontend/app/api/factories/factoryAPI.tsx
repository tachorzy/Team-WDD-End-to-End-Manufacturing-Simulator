import axios from "axios";

// TODO: currently the api calls are running infinitely

export interface Location {
    longitude: number;
    latitude: number;
}
export interface Factory {
    factoryId?: string; // TODO: temporarily optional?
    name: string;
    location: Location;
    description: string;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AWS_ENDPOINT,
    headers: {
        "Content-Type": "application/json",
    },
});

const getFactory = async (factoryId: string): Promise<Factory> => {
    try {
        const response = await api.get<Factory>("/factories", {
            params: { factoryId },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch factory with ID ${factoryId}:`, error);
        throw new Error(`Failed to fetch factory with ID ${factoryId}`);
    }
};

const createFactory = async (newFactory: Factory): Promise<Factory> => {
    try {
        const payload = {
            body: JSON.stringify(newFactory),
        };
        const response = await api.post<Factory>("/factories", payload);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Failed to add new factory:", error);
        throw new Error("Failed to add new factory");
    }
};

const getAllFactories = async (): Promise<Factory[]> => {
    try {
        const response = await api.get<Factory[]>("/factories");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all factories: ", error);
        throw new Error("Failed to fetch all factories.");
    }
};

export { getFactory, createFactory, getAllFactories };
