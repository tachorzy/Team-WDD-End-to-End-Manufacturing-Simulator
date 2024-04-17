import {
    BackendConnector,
    GetConfig,
    PostConfig,
    PutConfig,
    DeleteConfig,
} from "@/app/api/_utils/connector";
import { Property } from "../_utils/types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("id");
    const config: GetConfig = {
        resource: "properties",
        params: propertyId ? { id: propertyId } : undefined,
    };

    try {
        if (propertyId) {
            const data = propertyId
                ? await BackendConnector.get<Property>(config)
                : await BackendConnector.get<Property[]>(config);
            return new Response(JSON.stringify(data));
        }
        return new Response(
            JSON.stringify({
                error: "Missing propertyId query parameter",
            }),
        );
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ success: false }));
    }
}
export async function POST(req: Request) {
    try {
        const payload = (await req.json()) as Property;
        const config: PostConfig<Property> = {
            resource: "properties",
            payload,
        };
        const createdProperty = await BackendConnector.post<Property>(config);
        return new Response(JSON.stringify(createdProperty));
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ success: false }));
    }
}

export async function PUT(req: Request) {
    try {
        const payload = (await req.json()) as Property;
        const config: PutConfig<Property> = {
            resource: "properties",
            payload,
        };
        const updatedProperty = await BackendConnector.put<Property>(config);
        return new Response(JSON.stringify({ updatedProperty }));
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ success: false }));
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const propertyId = searchParams.get("id");
        const config: DeleteConfig<Property> = {
            resource: "properties",
            params: propertyId ? { id: propertyId } : undefined,
        };
        const deletedProperty = await BackendConnector.delete<Property>(config);
        return new Response(JSON.stringify({ deletedProperty }));
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ success: false }));
    }
}
