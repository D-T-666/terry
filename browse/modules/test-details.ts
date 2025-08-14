import { deselectElement } from "../../editor/src/element-manager.ts";
import { updateTest } from "../../scripts/api.ts";
import { AttributeSelectorElement, type AttributeSelectorOptions } from "../../util/attribute-selector/main.ts";
import { getTestWithId } from "./data.ts";

const testModal = document.getElementById("test-details") as HTMLDialogElement;
const saveTestDetailsButton = document.getElementById("save-test-details") as HTMLButtonElement;
const editTestContentButton = document.getElementById("open-test-editor") as HTMLButtonElement;
const closeTestModalButton = document.getElementById("close-test-details") as HTMLButtonElement;

const testNameInput = document.getElementById("title") as HTMLInputElement;
const testDescriptionInput = document.getElementById("description") as HTMLTextAreaElement;
const testAttributeSelector = document.getElementById("attributes") as AttributeSelectorElement;

function displayTestData(testData: {name: string, description: string, tags: AttributeSelectorOptions}) {
	testNameInput.value = testData.name;
	testDescriptionInput.value = testData.description;
	testAttributeSelector.value = testData.tags;
}

let currentTestId: string | undefined = undefined;

export async function openTestDetails(testId: string) {
	console.log(testId)
	displayTestData(await getTestWithId(testId));

	currentTestId = testId;

	testModal.showModal();
}

closeTestModalButton.addEventListener("click", () => {
	testModal.close();
})

saveTestDetailsButton.addEventListener("click", () => {
	if (currentTestId !== undefined) {
		updateTest(currentTestId, {
			name: testNameInput.value,
			description: testDescriptionInput.value,
			tags: testAttributeSelector.value
		});
	}
})

editTestContentButton.addEventListener("click", () => {
	window.location.href = `/editor/?id=${currentTestId}`;
})
