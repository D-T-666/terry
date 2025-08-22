import { getAuthHeaders } from "./auth.ts";

export const apiURL = "https://eko.dimitri.ge/api";

export type TestData = {
	id?: string,
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

export async function getTestContent(id: string): Promise<{content: string, gradingScheme?: any, id: string}> {
	const response = await fetch(`${apiURL}/test/${id}`, {
		headers: getAuthHeaders()
	});

	if (!response.ok) {
		throw new Error(response.statusText);
	}

	const json = await response.json();

	return {
		id,
		...json
	};
}

export async function getTestGradingScheme(id: string) {
	const response = await fetch(`${apiURL}/test/${id}`, {
		headers: getAuthHeaders()
	});

	const json = await response.json();

	return json;
}

export function updateTest(id: string, data: TestData) {
	console.log("trying to upload", data, "for test", id)
	return fetch(`${apiURL}/test/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders()
		},
		body: JSON.stringify({
			...data,
			gradingScheme: JSON.stringify(data.gradingScheme),
		})
	});
}

export function deleteTest(id: string) {
	return fetch(`${apiURL}/test/${id}`, {
		headers: getAuthHeaders(),
		method: "DELETE"
	});
}

export function getImageURL(testId: string, imageName: string) {
	return `${apiURL}/image/${testId}/${imageName}`;
}

export async function uploadImage(testId: string, imageName: string, file: File) {
	const response = await fetch(`${apiURL}/image/${testId}/${imageName}`, {
		method: "POST",
		headers: {
			"Content-Type": file.type,
			...getAuthHeaders(),
		},
		body: file
	});
	return response.ok
}
