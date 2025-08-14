import { getAuthHeaders } from "./auth.ts";

export const apiURL = "https://eko.dimitri.ge/api";

type TestData = {
	name?: string,
	description?: string,
	gradingScheme?: any,
	content?: string,
	tags?: {[category: string]: string[]}
};

export async function loadTests(): Promise<TestData[]> {
  const response = await fetch(`${apiURL}/test/list`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
  	console.log(response.statusText);
	  return [];
  }

  const json = await response.json();

  return json["tests"];
}

export function createNewTest(): Promise<Response> {
  return fetch(`${apiURL}/test`, {
	  method: "POST",
    headers: getAuthHeaders(),
  });
}

export async function getTestContent(id: string): Promise<{content: string, gradingScheme?: any}> {
	const response = await fetch(`${apiURL}/test/${id}`, {
		headers: getAuthHeaders()
	});

	if (!response.ok) {
		throw new Error(response.statusText);
	}

	const json = await response.json();

	return json;
}

export async function getTestGradingScheme(id: string) {
	const response = await fetch(`${apiURL}/test/${id}`, {
		headers: getAuthHeaders()
	});

	const json = await response.json();

	return json;
}

export function updateTest(id: string, data: TestData) {
	return fetch(`${apiURL}/test/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders()
		},
		body: JSON.stringify(data)
	});
}
