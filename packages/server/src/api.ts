export const baseURL =
  process.env.NEXT_PUBLIC_FLOE_BASE_URL ?? "https://api.floe.dev/";

const api =
  (apiKeyId: string, secretKey: string) =>
  async <T>(uri: string, settings = {}): Promise<T> => {
    const response = await fetch(baseURL + uri, {
      headers: {
        Accept: "application/json",
        ["x-api-id"]: apiKeyId,
        ["x-api-key"]: secretKey,
      },
      ...settings,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json() as Promise<T>;
  };

export default api;
