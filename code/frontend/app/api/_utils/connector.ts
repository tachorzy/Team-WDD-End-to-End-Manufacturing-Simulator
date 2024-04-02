import { BASE_URL } from "@/app/api/_utils/constants";

export interface GetConfig {
    resource: string;
    params?: Record<string, string>;
}

class Connector {
    private readonly baseURL: string;

    constructor(url: string = "") {
        this.baseURL = url;
    }

    async get<T>({ resource, params }: GetConfig): Promise<T> {
        const url = new URL(`${this.baseURL}/${resource}`);

        if (params) {
            Object.keys(params).forEach((key) =>
                url.searchParams.append(key, params[key]),
            );
        }

        const response = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Fetch error: ${response.status} ${response.statusText}`,
            );
        }

        return response.json() as Promise<T>;
    }
}

export const BackendConnector = new Connector(BASE_URL);
