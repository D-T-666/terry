import { loadTests } from '../../scripts/mock-api.js';
export { loadTests } from '../../scripts/mock-api.js';

let tests: any = null;
export async function getTestWithId(id: string) {
	if (tests === null) {
		tests = await loadTests();
	}

	console.log(tests)
	for (const test of tests) {
		if (test.id === id) {
			return test;
		}
	}
	return undefined;
}
