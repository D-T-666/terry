const api = "https://eko.dimitri.ge/api";

const authHeaders = {
	"Authorization": ""
};

export async function loadTests() {
	const response = await fetch(`${api}/test/list`, {
		headers: authHeaders,
	});

	const json = await response.json();

	return json['tests'];
}

export type Role = "admin" | "teacher" | "student";

export function register(data: {username: string, password: string, role: Role}): Promise<Response> {
	return fetch(`${api}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	});
}


export function login(data: {username: string, password: string}): Promise<Response> {
	return fetch(`${api}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data)
	});
}
