const rawUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://localmart-api-gateway.onrender.com";

export const API_BASE_URL = rawUrl.endsWith("/") ? rawUrl : `${rawUrl}/`;
