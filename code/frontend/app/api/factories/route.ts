import { BASE_URL } from "@/app/api/_utils/constants";
import { Factory } from "@/app/api/_utils/types";

const options: RequestInit = {
    headers: {
        "Content-Type": "application/json",
    },
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const factoryId = searchParams.get("id") || "";

    try {
        const response = await fetch(
            `${BASE_URL}/factories?id=${factoryId}`,
            options,
        );

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: {
                        message: `Failed to fetch factory with ID ${factoryId}: ${response.statusText}`,
                    },
                }),
            );
        }

        const data = (await response.json()) as Factory;

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
                error,
            }),
        );
    }
}
