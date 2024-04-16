import { Asset } from "@/app/api/_utils/types";
import {
    BackendConnector,
    GetConfig,
    PostConfig,
    PutConfig,
} from "@/app/api/_utils/connector";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get("factoryId");
    const assetId = searchParams.get("assetId");

    try {
        if (factoryId) {
            const config: GetConfig = {
                resource: "assets",
                params: { factoryId },
            };
            const assets = await BackendConnector.get<Asset[]>(config);
            return new Response(JSON.stringify(assets));
        }
        if (assetId) {
            const config: GetConfig = {
                resource: "assets",
            };
            const asset = await BackendConnector.get<Asset>(config);
            return new Response(JSON.stringify(asset));
        }
        return new Response(
            JSON.stringify({
                error: "Missing factoryId or assetId query parameter",
            }),
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false }));
    }
}

export async function POST(request: Request) {
    try {
        const payload = (await request.json()) as Asset;
        const config: PostConfig<Asset> = {
            resource: "assets",
            payload,
        };
        const createdAsset = await BackendConnector.post<Asset>(config);
        return new Response(JSON.stringify(createdAsset));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false }));
    }
}

export async function PUT(request: Request) {
    try {
        const payload = (await request.json()) as Asset;
        const config: PutConfig<Asset> = {
            resource: "assets",
            payload,
        };
        const updatedAsset = await BackendConnector.put<Asset>(config);
        return new Response(JSON.stringify({ updatedAsset }));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false }));
    }
}
