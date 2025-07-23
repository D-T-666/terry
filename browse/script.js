import { renderTestListing } from "./modules/elements.js";
import { openTestDetails } from "./modules/test-details.js";
import { loadTests } from "./modules/data.js";

const list = document.getElementById("list");

list.addEventListener("click", (event) => {
	if (event.target.classList.contains("open")) {
		openTestDetails(event.target.parentElement.parentElement.dataset.id);
	}
})

loadTests((tests) => {
	for (const test of tests) {
		const t = renderTestListing(test);
		list.appendChild(t.cloneNode(true));
	}
})
