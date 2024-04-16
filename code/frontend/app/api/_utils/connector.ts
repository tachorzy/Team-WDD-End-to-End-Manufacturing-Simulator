import {
    BASE_BACKEND_API_URL,
    BASE_NEXT_API_URL,
} from "@/app/api/_utils/constants";

export interface GetConfig {
    resource: string;
    params?: Record<string, string>;
}

export interface PostConfig<T> {
    resource: string;
    payload: T;
}

export interface PutConfig<T> {
    resource: string;
    payload: T;
}

export interface DeleteConfig<T>{
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
            throw new Error(`Fetch error: ${response.statusText}`);
        }

        return (await response.json()) as Promise<T>;
    }

    async post<T>({ resource, payload }: PostConfig<T>): Promise<T> {
        const url = new URL(`${this.baseURL}/${resource}`);

        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`);
        }

        return (await response.json()) as Promise<T>;
    }

    async put<T>({ resource, payload }: PutConfig<T>): Promise<T> {
        const url = new URL(`${this.baseURL}/${resource}`);

        const response = await fetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(
                `Fetch error: ${response.statusText} (${response.status})`,
            );
        }

        return (await response.json()) as Promise<T>;
    }
    async delete<T>({ resource, params }: DeleteConfig<T>): Promise<T> {
        const url = new URL(`${this.baseURL}/${resource}`);

        if (params) {
            Object.keys(params).forEach((key) =>
                url.searchParams.append(key, params[key]),
            );
        }

        const response = await fetch(url.toString(), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`);
        }

        return (await response.json()) as Promise<T>;
    }
}

export const BackendConnector = new Connector(BASE_BACKEND_API_URL);
export const NextServerConnector = new Connector(BASE_NEXT_API_URL);
