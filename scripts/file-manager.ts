import { getTestContent, updateTest } from "./api.ts";

type TestFile = {
	id: string | null;
	content: string;
	gradingScheme?: {[key: string]: any};
};

export let currentFile: TestFile | undefined = undefined;

export async function storeFile(file: TestFile, id?: string) {
	currentFile = file;

	localStorage.setItem(
		"currentFile",
		JSON.stringify(file),
	);

	if (id !== undefined) {
		await updateTest(id, file);
	}
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
			id: null,
			content: '<div data-type="container" data-name="მთავარი კონტეინერი" id="0" data-pages="1"></div>',
		};
	}

	return currentFile!;
}
