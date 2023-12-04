import { HTTPMethods } from "@/types/index.type";

export const fetcher = async (url: string) => {
  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch (error) {
    throw new Error("Error while getting token");
  }

  console.info(`[GET] ${import.meta.env.APP_BASE_API + url}`);
  if (!token) throw new Error("There is no token");
  const res = await fetch(import.meta.env.APP_BASE_API + url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Content-type": "application/json",
    },
  });

  if (!res.ok) {
    console.error(`[GET] ${import.meta.env.APP_BASE_API + url}`);
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
      body?: object;
    }
  ): Promise<any>;
}

export const updater: Updater = async (url, { method, body }) => {
  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch (error) {
    throw new Error("Error while getting token");
  }

  if (!token) throw new Error("There is no token");
  const options: any = {
    method: method,
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Content-type": "application/json",
    },
  };
  if (method !== "GET" && method !== "HEAD") options.body = JSON.stringify(body);
  console.info(`[${method}] ${import.meta.env.APP_BASE_API + url}`);
  const res = await fetch(import.meta.env.APP_BASE_API + url, options);
  if (!res.ok) {
    console.error(`[${method}] ${import.meta.env.APP_BASE_API + url}`);
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
