import { TestData, updateTest, deleteTest } from "../../scripts/api.ts";
import { AttributeSelectorElement } from "../../util/attribute-selector/main.ts";
import { addTest } from "../script.ts";
import { getTestWithId } from "./data.ts";

const testModal = document.getElementById("test-details") as HTMLDialogElement;
const saveTestDetailsButton = document.getElementById("save-test-details") as HTMLButtonElement;
const editTestContentButton = document.getElementById("open-test-editor") as HTMLButtonElement;
const closeTestModalButton = document.getElementById("close-test-details") as HTMLButtonElement;
const deleteTestButton = document.getElementById("delete-test") as HTMLButtonElement;
const openPlayerButton = document.getElementById("open-test-player") as HTMLButtonElement;

const testNameInput = document.getElementById("title") as HTMLInputElement;
const testDescriptionInput = document.getElementById("description") as HTMLTextAreaElement;
const testAttributeSelector = document.getElementById("attributes") as AttributeSelectorElement;

function displayTestData(testData: TestData) {
	testNameInput.value = testData.name!;
	testDescriptionInput.value = testData.description!;
	testAttributeSelector.value = testData.tags!;
}

let currentTestId: string | undefined = undefined;

export async function openTestDetails(testId: string) {
	const testData = await getTestWithId(testId);
	displayTestData(testData);

	currentTestId = testId;

	testModal.showModal();
}

closeTestModalButton.addEventListener("click", () => {
	testModal.close();
})

saveTestDetailsButton.addEventListener("click", async () => {
	if (currentTestId !== undefined) {
		const testData = {
			name: testNameInput.value,
			description: testDescriptionInput.value,
			tags: testAttributeSelector.value
		};

		await updateTest(currentTestId, testData);

		addTest(currentTestId, testData);
		testModal.close();
	}
})

editTestContentButton.addEventListener("click", () => {
	window.location.href = `/editor/?id=${currentTestId}`;
})

deleteTestButton.addEventListener("click", async () => {
	if (currentTestId !== undefined) {
		await deleteTest(currentTestId);
	}
})

openPlayerButton.addEventListener("click", () => {
	window.location.href = `/player/?id=${currentTestId}`;
})
