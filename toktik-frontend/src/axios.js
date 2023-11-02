import axios from "axios";
import { EventBus } from "./eventBus";
import router from "@/router";

const instance = axios.create();

const token = localStorage.getItem("jwt-token");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

instance.interceptors.request.use(
  async (config) => {
    if (!localStorage.getItem("jwt-token")) {
      router.push("/login").catch(() => {});
      return;
    }

    const newAxios = axios.create();
    newAxios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          return Promise.resolve({ isError: false, response: error.response });
        }
      }
    );
    try {
      const tokenCheckResponse = await newAxios.post("/api/auth/jwt/verify/", {
        token: localStorage.getItem("jwt-token"),
      });
      if (
        tokenCheckResponse.response.status === 401 &&
        localStorage.getItem("jwt-token-refresh")
      ) {
        try {
          const refresherResponse = await newAxios.post(
            "/api/auth/jwt/refresh/",
            { refresh: localStorage.getItem("jwt-token-refresh") }
          );
          localStorage.setItem("jwt-token", refresherResponse.data.access);
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${refresherResponse.data.access}`;
          config.headers.Authorization = `Bearer ${refresherResponse.data.access}`;
          return config;
        } catch (e) {
          localStorage.removeItem("jwt-token");
          localStorage.removeItem("jwt-token-refresh");
          EventBus.$emit("show-modal", {
            title: "Unauthorized",
            message: "Your session has expired. Please Log-in again",
          });
          router.push("/login").catch(() => {});
        }
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ERROR INTERCEPT
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    EventBus.$emit("stop-video"); // done in attempt to stop any active video
    const status = error.response.status ?? 0;
    if (status === 401) {
      EventBus.$emit("show-modal", {
        title: "Unauthorized",
        message: "Please Log-in again",
      });
      const token = localStorage.getItem("jwt-token");
      if (token) {
        localStorage.removeItem("jwt-token");
      }
      const refresh_token = localStorage.getItem("jwt-token-refresh");
      if (refresh_token) {
        localStorage.removeItem("jwt-token-refresh");
      }

      instance.defaults.headers.common["Authorization"] = "";

      router.push("/login").catch(() => {});
    }

    EventBus.$emit("show-modal", {
      title: "Error occurred",
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default instance;
