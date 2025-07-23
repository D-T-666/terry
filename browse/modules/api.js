const api = '...';

const authHeaders = '...';

export async function loadTests(callback) {
	const response = await fetch(`${api}/test/list`, {
		headers: authHeaders
	});

	const json = await response.json();

	return json['tests'];
}
