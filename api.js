// Simple API wrapper
const API_URL = "/api";

export async function request(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important for HttpOnly cookies
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials) => request("/auth/login", "POST", credentials),
    register: (userData) => request("/auth/register", "POST", userData),
    me: () => request("/auth/me"),
    logout: () => request("/auth/logout", "POST"),
    getUsers: () => request("/auth/users"),
  },
  tasks: {
    getAll: (projectId) => request(`/tasks?projectId=${projectId || ""}`),
    getStats: () => request("/tasks/stats"),
    create: (taskData) => request("/tasks", "POST", taskData),
    updateStatus: (id, status) => request(`/tasks/${id}`, "PATCH", { status }),
  },
  projects: {
    getAll: () => request("/projects"),
    create: (projectData) => request("/projects", "POST", projectData),
    addMember: (projectId, userId) => request("/projects/add-member", "POST", { projectId, userId }),
  },
};
