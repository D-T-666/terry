import { getTestWithId } from "./data.js";

const testModal = document.getElementById("test-details");
const closeTestModal = document.getElementById("close-test-details");

function displayTestData(testData) {
	document.getElementById("სახელი").value = testData.name;
	document.getElementById("აღწერა").innerText = testData.description;
}

export function openTestDetails(testId) {
	displayTestData(getTestWithId(testId));

	testModal.showModal();
}

closeTestModal.addEventListener("click", () => {
	testModal.close();
})
