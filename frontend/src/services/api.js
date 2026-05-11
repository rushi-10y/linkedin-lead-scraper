const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 15000;
  }

  buildUrl(endpoint) {
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${normalizedEndpoint}`;
  }

  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...((!isFormData && options.body) ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    };

    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again.");
      }

      if (response.status === 204) {
        return null;
      }

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(data?.message || `Request failed (${response.status})`);
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }
      console.error("API error:", error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE"
    });
  }

  async download(endpoint) {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(this.buildUrl(endpoint), { headers });

    if (!response.ok) {
      throw new Error(`Download failed (${response.status})`);
    }

    return response.blob();
  }
}

export default new ApiService();
