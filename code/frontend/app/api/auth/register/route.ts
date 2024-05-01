import { BackendConnector, PostConfig } from "@/app/api/_utils/connector";
import { User } from "@/app/api/_utils/types";

export async function POST(request: Request) {
    try {
        const payload = (await request.json()) as User;
        const config: PostConfig<User> = {
            resource: "auth/register",
            payload,
        };

        await BackendConnector.post(config);

        return new Response(JSON.stringify({ success: true }));
    } catch (error) {
        return new Response(JSON.stringify({ success: false }));
    }
}
