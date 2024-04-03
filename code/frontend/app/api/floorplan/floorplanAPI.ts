import { Floorplan } from "@/app/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const requestOptions: RequestInit = {
    headers: {
        "Content-Type": "application/json",
    },
};

export const createFloorplan = async (
    imageData: string,
    factoryId: string,
): Promise<Floorplan> => {
    const floorplan = { imageData, factoryId };
    try {
        const response = await fetch(`${BASE_URL}/floorplan`, {
            ...requestOptions,
            method: "POST",
            body: JSON.stringify(floorplan),
        });
        if (!response.ok) {
            throw new Error(`Failed to save floorplan ${response.statusText}`);
        }
        return (await response.json()) as Floorplan;
    } catch (error) {
        console.error("Failed to save floorplan", error);
        throw new Error("Failed to save floorplan");
    }
};

export const getFloorplan = async (id: string): Promise<Floorplan | null> => {
    try {
        const response = await fetch(`${BASE_URL}/floorplan/?id=${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                console.log(`No floorplan found for factory ID ${id}`);
                return null;
            }
            throw new Error(`Failed to get floorplan: ${response.statusText}`);
        }
        return (await response.json()) as Floorplan;
    } catch (error) {
        console.error("Failed to get floorplan", error);
        throw new Error("Failed to get floorplan");
    
    }
}