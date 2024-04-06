import {
    BackendConnector,
    GetConfig,
    PostConfig,
    PutConfig,
} from "@/app/api/_utils/connector";
import { Floorplan } from "@/app/api/_utils/types";

export async function POST(request: Request) {
    const payload = (await request.json()) as Floorplan;

    const config: PostConfig<Floorplan> = {
        resource: "floorplan",
        payload,
    };

    try {
        const data = await BackendConnector.post<Floorplan>(config);

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

    const floorplanId = searchParams.get("id");

    const config: GetConfig = {
        resource: "floorplan",
        params: floorplanId ? { id: floorplanId } : undefined,
    };

    try {
        const data = floorplanId
            ? await BackendConnector.get<Floorplan>(config)
            : await BackendConnector.get<Floorplan[]>(config);

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
