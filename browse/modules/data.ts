import { loadTests } from '../../scripts/api.ts';
export { loadTests } from '../../scripts/api.ts';

export async function getTestWithId(id: string) {
	const tests = await loadTests();

	for (const test of tests) {
		if (test.id === id) {
			return test;
		}
	}
	throw new Error("No test with id " + id + " found");
}
