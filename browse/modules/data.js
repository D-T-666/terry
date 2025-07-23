export { loadTests } from './mock-api.js'

export function getTestWithId(id) {
	for (const test of tests) {
		if (test.id === id) {
			return test;
		}
	}
	return undefined;
}
