import { mainContent, treeView } from "./panels.ts";
import * as page from "./pages.ts"
import { getCurrentScheme } from "./grading.ts";
import { realToInspector } from "./elements/index.ts";
import { registerID } from "./element-manager.ts";
import { loadFile, storeFile, TestFile } from "../../scripts/file-manager.ts";
import { UndoBuffer } from "./undo-buffer.ts";

const nameElement = document.getElementById("test-name") as HTMLInputElement;

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const currentTestId = searchParams.get("id");

const removeDynamicAttributes = (elt: HTMLElement) => {
	elt.classList.remove("current");
	if (elt.className === "") {
		elt.removeAttribute("class")
	}

	for (const child of elt.children) {
		removeDynamicAttributes(child as HTMLElement);
	}
};

class TestManager {
	get content(): string {
		const elt = mainContent.cloneNode(true) as HTMLElement;

		removeDynamicAttributes(elt);

		return elt.innerHTML!.trim().replaceAll(/[\s\t][\s\t]+/g, '').replaceAll(' contenteditable="true"', '');
	}

	get gradingScheme(): string {
		return JSON.stringify(getCurrentScheme());
	}

	get name(): string {
		return nameElement.value;
	}

	export(): TestFile {
		return {
			content: this.content,
			gradingScheme: this.gradingScheme,
			name: this.name
		}
	}

	load({name, content, gradingScheme}: TestFile) {
		mainContent.innerHTML = content!;

		// Make spans and paragraphs contenteditable
		for (const paragraph of mainContent.getElementsByTagName('p')) {
			paragraph.contentEditable = 'true';
		}
		for (const span of mainContent.getElementsByTagName('span')) {
			span.contentEditable = 'true';
		}

		registerID(mainContent.firstChild as HTMLElement);

		if (gradingScheme) {
			const parsedGradingScheme = JSON.parse(gradingScheme);

			for (const id of Object.keys(parsedGradingScheme)) {
				(document.getElementById(id)! as HTMLInputElement).value = parsedGradingScheme[id].correct;
			}
		}

		// Reset the tree view
		treeView.innerHTML = "";
		treeView.appendChild(realToInspector(mainContent.firstElementChild as HTMLElement) as HTMLElement);
		page.importElement(mainContent.firstElementChild as HTMLElement);
		
		if (name) {
			nameElement.value = name;
		}
	}
}

export const undoBuffer = new UndoBuffer<TestFile>();

document.getElementById("undo")!.addEventListener("click", () => {
	if (undoBuffer.canGoBack()) {
		const version = undoBuffer.goBack();
		testManager.load(version);
	} else {
		console.log("can't go back anymore");
	}
});
document.getElementById("redo")!.addEventListener("click", () => {
	if (undoBuffer.canGoForward()) {
		const version = undoBuffer.goForward();
		testManager.load(version);
	} else {
		console.log("can't go forward anymore");
	}
});

export function updateTest() {
	undoBuffer.update(testManager.export());
}

export const testManager = new TestManager();

document.getElementById("save-test")!.addEventListener("click", async () => {
	await storeFile(testManager.export(), currentTestId ?? undefined);
});

async function initialize() {
	const initialFile = await loadFile(currentTestId as string | undefined);
	testManager.load(initialFile);
	undoBuffer.update(initialFile);
}
initialize();
