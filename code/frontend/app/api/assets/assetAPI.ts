import { Asset } from "@/app/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const requestOptions: RequestInit = {
    headers: {
        "Content-Type": "application/json",
    },
};

export const createAsset = async (asset: Asset) => {
    const response = await fetch(`${BASE_URL}/assets`, {
        ...requestOptions,
        method: "POST",
        body: JSON.stringify(asset),
    });
    return await response.json() as Asset;
}

export const getAssetsForFactory = async (factoryId: string) => {
    const response = await fetch(`${BASE_URL}/assets?factoryId=${factoryId}`, requestOptions);
    return await response.json() as Asset[];
}
