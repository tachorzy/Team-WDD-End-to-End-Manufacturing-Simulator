import {
    BackendConnector,
    GetConfig,
    PostConfig,
} from "@/app/api/_utils/connector";
import { Model } from "@/app/api/_utils/types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get("factoryId");
    const modelId = searchParams.get("id");

    try {
        if (factoryId) {
            const config: GetConfig = {
                resource: "assets",
                params: { factoryId },
            };
            const models = await BackendConnector.get<Model[]>(config);
            return new Response(JSON.stringify(models));
        }
        if (modelId) {
            const config: GetConfig = {
                resource: "models",
            };
            const model = await BackendConnector.get<Model>(config);
            return new Response(JSON.stringify(model));
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
    const payload = (await request.json()) as Model;

    const config: PostConfig<Model> = {
        resource: "models",
        payload,
    };

    try {
        const data = await BackendConnector.post<Model>(config);

        return new Response(JSON.stringify(data));
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
            }),
        );
    }
}
