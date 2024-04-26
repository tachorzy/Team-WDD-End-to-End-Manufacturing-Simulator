import {
    BackendConnector,
    GetConfig,
    PostConfig,
} from "@/app/api/_utils/connector";
import { Model } from "@/app/api/_utils/types";

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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const modelId = searchParams.get("id");

    const config: GetConfig = {
        resource: "models",
        params: modelId ? { id: modelId } : undefined,
    };

    try {
        const data = modelId
            ? await BackendConnector.get<Model>(config)
            : await BackendConnector.get<Model[]>(config);

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
