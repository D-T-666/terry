import { getAuthHeaders } from "./auth.ts";
import { UnautorizedError } from "./errors.ts";

export type TestData = {
	id?: string,
	name?: string,
	description?: string,
	gradingScheme?: any,
	content?: string,
	tags?: {[category: string]: string[]}
};

// TODO: put this in the environment variables
export const apiURL: string = "https://terryapi.dimitri.ge/api";

export async function loadTests(): Promise<TestData[]> {
	const response = await fetch(`${apiURL}/test/list`, {
		headers: getAuthHeaders(),
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new UnautorizedError();
		} else {
			const message = JSON.stringify(await response.json());
			throw new Error(message);
		}
	}

	const json = await response.json();

	return json["tests"];
}

export async function createNewTest(): Promise<string> {
	const response = await fetch(`${apiURL}/test`, {
		method: "POST",
		headers: getAuthHeaders(),
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new UnautorizedError();
		} else {
			const message = JSON.stringify(await response.json());
			throw new Error(message);
		}
	}

	const json = await response.json();

	return json;
}

export async function getTestContent(id: string): Promise<TestData> {
	const response = await fetch(`${apiURL}/test/${id}`, {
		headers: getAuthHeaders()
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new UnautorizedError();
		} else {
			const message = JSON.stringify(await response.json());
			throw new Error(message);
		}
	}

	const json = await response.json();

	return {
		id,
		...json
	};
}

export async function getTestGradingScheme(id: string): Promise<string> {
	const response = await fetch(`${apiURL}/test/${id}`, {
		headers: getAuthHeaders()
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new UnautorizedError();
		} else {
			const message = JSON.stringify(await response.json());
			throw new Error(message);
		}
	}

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
	const formData = new FormData();

	formData.append("image", file);

	const response = await fetch(getImageURL(testId, imageName), {
		method: "POST",
		headers: {
			...getAuthHeaders(),
		},
		body: formData
	});

	return response.ok
}

export async function getAvailableTags() {
	const res = await fetch(`${apiURL}/tags`);
	if (!res.ok) {
		throw new Error("can't retireve tags");
	}
	return await res.json();
}

export function createCategory(categoryName: string) {
	return fetch(`${apiURL}/category`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders()
		},
		body: JSON.stringify({
			name: categoryName
		})
	});
}

export function deleteCategory(categoryName: string) {
	return fetch(`${apiURL}/category/${categoryName}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	});
}

export function createTag(categoryName: string, tagName: string) {
	return fetch(`${apiURL}/category/${categoryName}/tag`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders()
		},
		body: JSON.stringify({
			name: tagName,
			categoryName: categoryName
		})
	});
}

export function deleteTag(categoryName: string, tagName: string) {
	return fetch(`${apiURL}/category/${categoryName}/tag/${tagName}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	});
}
