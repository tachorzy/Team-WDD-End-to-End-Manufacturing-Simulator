import {
    BackendConnector,
    GetConfig,
    PostConfig,
} from "@/app/api/_utils/connector";
import { Property } from "@/app/api/_utils/types";

export async function POST(request: Request) {
    const payload = (await request.json()) as Property;

    const config: PostConfig<Property> = {
        resource: "factories",
        payload,
    };

    try {
        const data = await BackendConnector.post<Property>(config);

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

    const propertyId = searchParams.get("id");
    const config: GetConfig = {
        resource: "factories",
        params: propertyId ? { id: propertyId } : undefined,
    };

    try {
        const data = propertyId
            ? await BackendConnector.get<Property>(config)
            : await BackendConnector.get<Property[]>(config);

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
