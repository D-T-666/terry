import { apiURL } from "./api.ts";

export type Role = "Admin" | "Teacher" | "Student";

export function getAuthHeaders(): { Authorization?: string } {
	const token = localStorage.getItem("authToken");
	if (token) {
		return { Authorization: `Bearer ${token}` };
	} else {
		return {};
	}
}

export async function register(
	data: { username: string; password: string; role: Role },
): Promise<boolean> {
	return (await fetch(`${apiURL}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders()
		},
		body: JSON.stringify(data),
	})).ok;
}

export async function login(
	data: { username: string; password: string, remember: boolean },
): Promise<void> {
	console.log(data)
	const response = await fetch(`${apiURL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders()
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Can't log in");
	}

	const { token } = await response.json();

	localStorage.setItem("authToken", token);
}
