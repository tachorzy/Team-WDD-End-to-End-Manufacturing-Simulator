import {
    BackendConnector,
    GetConfig,
    PostConfig,
    PutConfig,
} from "@/app/api/_utils/connector";
import { Factory } from "@/app/api/_utils/types";

export async function POST(request: Request) {
    const payload = (await request.json()) as Factory;

    const config: PostConfig<Factory> = {
        resource: "factories",
        payload,
    };

    try {
        const data = await BackendConnector.post<Factory>(config);

        return new Response(
            JSON.stringify({
                success: true,
                data,
            }),
        );
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

    const factoryId = searchParams.get("id");
    const config: GetConfig = {
        resource: "factories",
        params: factoryId ? { id: factoryId } : undefined,
    };

    try {
        const data = factoryId
            ? await BackendConnector.get<Factory>(config)
            : await BackendConnector.get<Factory[]>(config);

        return new Response(
            JSON.stringify({
                success: true,
                data,
            }),
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
            }),
        );
    }
}

export async function PUT(request: Request) {
    const payload = (await request.json()) as Factory;

    const config: PutConfig<Factory> = {
        resource: "factories",
        payload,
    };

    try {
        await BackendConnector.put<Factory>(config);

        return new Response(
            JSON.stringify({
                success: true,
            }),
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
            }),
        );
    }
}
