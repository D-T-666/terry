import { loadTests } from '../../scripts/api.ts';
export { loadTests } from '../../scripts/api.ts';

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
