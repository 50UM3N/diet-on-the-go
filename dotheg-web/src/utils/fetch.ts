import { HTTPMethods } from "@/types/index.type";
export const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  import.meta.env.DEV && console.info(`[GET] ${import.meta.env.APP_BASE_API + url}`);
  const res = await fetch(import.meta.env.APP_BASE_API + url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Content-type": "application/json",
    },
  });

  if (!res.ok) {
    import.meta.env.DEV && console.error(`[GET] ${import.meta.env.APP_BASE_API + url}`);
    try {
      return Promise.reject(await res.json());
    } catch (error) {
      return Promise.reject({ message: res.statusText });
    }
  }
  try {
    return await res.json();
  } catch (error) {
    return null;
  }
};

interface Updater {
  (
    url: string,
    options: {
      method?: HTTPMethods;
      body?: object | FormData;
    }
  ): Promise<any>;
}
export const updater: Updater = async (url, { method, body }) => {
  const token = localStorage.getItem("token");
  const options: any = {
    method: method,
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Content-type": "application/json",
    },
  };
  if (method !== "GET" && method !== "HEAD") options.body = body instanceof FormData ? body : JSON.stringify(body);
  import.meta.env.DEV && console.info(`[${method}] ${import.meta.env.APP_BASE_API + url}`);
  const res = await fetch(import.meta.env.APP_BASE_API + url, options);
  if (!res.ok) {
    import.meta.env.DEV && console.error(`[${method}] ${import.meta.env.APP_BASE_API + url}`);
    try {
      return Promise.reject(await res.json());
    } catch (error) {
      return Promise.reject({ message: res.statusText });
    }
  }
  try {
    return await res.json();
  } catch (error) {
    return null;
  }
};
