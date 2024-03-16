import { NextResponse } from "next/server";
import { Factory } from "@/app/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const requestOptions: RequestInit = {
    headers: {
        "Content-Type": "application/json",
    },
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

export async function GET() {
    const response = await getAllFactories();
    return NextResponse.json({
        data: response,
    });
}
