import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Factory } from "@/app/api/_utils/types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const config: GetConfig = {
        resource: "factories",
    };

    const factoryId = searchParams.get("id");
    if (factoryId) {
        config.params = {
            id: factoryId,
        };
    }

    try {
        const data = await BackendConnector.get<Factory>(config);

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
