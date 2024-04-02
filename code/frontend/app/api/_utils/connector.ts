import { BASE_URL } from "@/app/api/_utils/constants";

export interface GetConfig {
    resource: string;
    params?: Record<string, string>;
}

export interface PostConfig {
    resource: string;
    body: ReadableStream<Uint8Array> | null;
}

export interface PutConfig {
    resource: string;
    body: ReadableStream<Uint8Array> | null;
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

        return (await response.json()) as Promise<T>;
    }

    async post<T>({ resource, body }: PostConfig): Promise<T> {
        const url = new URL(`${this.baseURL}/${resource}`);

        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        if (!response.ok) {
            throw new Error(
                `Fetch error: ${response.status} ${response.statusText}`,
            );
        }

        return (await response.json()) as Promise<T>;
    }

    async put<T>({ resource, body }: PostConfig): Promise<T> {
        const url = new URL(`${this.baseURL}/${resource}`);

        const response = await fetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        if (!response.ok) {
            throw new Error(
                `Fetch error: ${response.status} ${response.statusText}`,
            );
        }

        return (await response.json()) as Promise<T>;
    }
}

export const BackendConnector = new Connector(BASE_URL);
