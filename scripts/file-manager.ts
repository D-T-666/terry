import { getTestContent, updateTest } from "./api.ts";

export type TestFile = {
	id?: string;
	name?: string;
	content: string;
	gradingScheme?: string;
};

export let currentFile: TestFile | undefined = undefined;

export async function storeFile(file: TestFile, id?: string) {
	currentFile = file;

	localStorage.setItem(
		"currentFile",
		JSON.stringify(file),
	);

	if (id !== undefined) {
		const res = await updateTest(id, file);
		return res.ok;
	}
	return false;
}

export async function loadFile(id?: string): Promise<TestFile> {
	// TODO: hook this up to the API
	if (id !== undefined) {
		try {
			currentFile = await getTestContent(id)
			return currentFile;
		} catch (e) {
			//
			console.log(e);
		}
	}

	const lsi = localStorage.getItem("currentFile"); // local storage item / locally stored item
	if (lsi !== undefined && lsi !== null) {
		currentFile = JSON.parse(lsi!) as TestFile;
	} else {
		currentFile = {
			content: '<div data-type="container" data-name="მთავარი კონტეინერი" id="0" data-pages="1"></div>',
		};
	}

	return currentFile!;
}
