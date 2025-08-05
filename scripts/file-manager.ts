type TestFile = {
	id?: string;
	name: string;
	description: string;
	tags: {[category: string]: string[]};
	content: string;
	gradingScheme: any;
};

let currentFile: TestFile | undefined = undefined;

export function storeFile(file: TestFile) {
	currentFile = file;

	// TODO: hook this up to the API
	localStorage.setItem(
		"currentFile",
		JSON.stringify(file)
	);
}

export function loadFIle(id?: string): TestFile {
	// TODO: hook this up to the API

	const lsi = localStorage.getItem("currentFile");
	if (lsi !== undefined && lsi !== null) {
		currentFile = JSON.parse(lsi!) as TestFile;
	} else {
		currentFile = {
			name: "ახალი ტესტი",
			description: "აღწერა",
			tags: {},
			content: '<div data-type="container" data-name="მთავარი კონტეინერი" id="0"></div>',
			gradingScheme: {}
		};
	}

	return currentFile!;
}
