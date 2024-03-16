import { NextResponse } from "next/server";
import { Factory } from "@/app/types/types";

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

export async function PUT(req: Request) {
    const data = await req.json();
    const response = await updateFactory(data);
    return NextResponse.json({
        data: response,
    });
}
