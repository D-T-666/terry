import { AttributeSelectorElement, type AttributeSelectorOptions } from "../../util/attribute-selector/main.ts";
import { getTestWithId } from "./data.ts";

const testModal = document.getElementById("test-details") as HTMLDialogElement;
const closeTestModal = document.getElementById("close-test-details") as HTMLButtonElement;

function displayTestData(testData: {name: string, description: string, tags: AttributeSelectorOptions}) {
	(document.getElementById("სახელი") as HTMLInputElement).value = testData.name;
	document.getElementById("აღწერა")!.innerText = testData.description;
	(document.getElementById("attributes") as AttributeSelectorElement).value = testData.tags;
}

export async function openTestDetails(testId: string) {
	console.log(testId)
	displayTestData(await getTestWithId(testId));

	testModal.showModal();
}

closeTestModal.addEventListener("click", () => {
	testModal.close();
})
