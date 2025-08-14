import { apiURL } from "./api.ts";

export type Role = "Admin" | "Teacher" | "Student";

const authHeaders = {
  "Authorization": "Bearer " + (localStorage.getItem("authToken") ?? ""),
};

export function getAuthHeaders() {
  return authHeaders;
}

export function register(
  data: { username: string; password: string; role: Role },
): Promise<Response> {
  return fetch(`${apiURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(data),
  });
}

export async function login(
  data: { username: string; password: string },
) {
  const response = await fetch(`${apiURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
  	return
  }
  const { token } = await response.json();

  localStorage.setItem("authToken", token);
  authHeaders.Authorization = token;
}
