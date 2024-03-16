import { NextResponse } from "next/server";
import { Factory } from "@/app/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const requestOptions: RequestInit = {
    headers: {
        "Content-Type": "application/json",
    },
};

const getFactory = async (factoryId: string): Promise<Factory> => {
    const response = await fetch(
        `${BASE_URL}/factories?id=${factoryId}`,
        requestOptions,
    );
    if (!response.ok)
        throw new Error(
            `Failed to fetch factory with ID ${factoryId}: ${response.statusText}`,
        );
    return response.json() as Promise<Factory>;
};

const getAllFactories = async (): Promise<Factory[]> => {
    const response = await fetch(`${BASE_URL}/factories`, requestOptions);
    if (!response.ok) throw new Error("Failed to fetch all factories");
    return response.json() as Promise<Factory[]>;
};

const createFactory = async (newFactory: Factory): Promise<Factory> => {
    const response = await fetch(`${BASE_URL}/factories`, {
        ...requestOptions,
        method: "POST",
        body: JSON.stringify(newFactory),
    });
    if (!response.ok) throw new Error("Failed to create new factory");
    return response.json() as Promise<Factory>;
};

const updateFactory = async (factoryData: Factory): Promise<Factory> => {
    const response = await fetch(`${BASE_URL}/factories`, {
        ...requestOptions,
        method: "PUT",
        body: JSON.stringify(factoryData),
    });
    if (!response.ok)
        throw new Error(`Failed to update factory: ${response.statusText}`);
    return response.json() as Promise<Factory>;
};

export async function handler(req: Request) {
    const { method } = req;
    switch (method) {
        case "GET": {
            const url = new URL(req.url);
            const factoryId = url.searchParams.get("id");
            if (factoryId) {
                const factory = await getFactory(factoryId);
                return NextResponse.json(factory);
            }
            const factories = await getAllFactories();
            return NextResponse.json(factories);
        }
        case "POST": {
            const data = (await req.json()) as Factory; 
            const factory = await createFactory(data);
            return NextResponse.json(factory);
        }
        case "PUT": {
            const data = (await req.json()) as Factory; 
            const factory = await updateFactory(data);
            return NextResponse.json(factory);
        }
        default:
            return new NextResponse("Method Not Allowed", { status: 405 });
    }
}
