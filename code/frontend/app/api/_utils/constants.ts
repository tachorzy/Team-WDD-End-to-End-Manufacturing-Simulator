export const BASE_BACKEND_API_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT || "";

const origin =
    typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";
export const BASE_NEXT_API_URL =
    process.env.NEXT_PUBLIC_DOMAIN || `${origin}/api`;
