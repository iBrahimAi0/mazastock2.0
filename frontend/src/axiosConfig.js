//axiosConfig.js
import axios from "axios";

const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/$/, "");

axios.defaults.baseURL = apiOrigin;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    // Keep older absolute URLs configurable while components are migrated to relative API paths.
    if (config.url?.startsWith("http://localhost:8000")) {
      config.url = config.url.replace("http://localhost:8000", apiOrigin);
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    return config;
  },
  (error) => Promise.reject(error),
);
