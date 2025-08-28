import { createTag, createCategory, deleteTag, deleteCategory, getAvailableTags } from "../scripts/api.ts";
import "./style.css";

const listElement = document.getElementById("categories")!;

function renderData(data: {[category: string]: string[]}) {
	listElement.innerHTML = "";

	const newCategoryButton = document.createElement("button");
	newCategoryButton.classList.add("new-category");
	newCategoryButton.textContent = "ახალი კატეგორიის დამატება";

	listElement.appendChild(newCategoryButton);

	for (const [category, tags] of Object.entries(data)) {
		const detailsElement = document.createElement("details");
		detailsElement.open = true;
		const summaryElement = document.createElement("summary");
		summaryElement.textContent = category;

		const removeButton = document.createElement("button");
		removeButton.classList.add("remove-category");
		removeButton.textContent = "კატეგორიის წაშლა";
		removeButton.dataset.categoryName = category;
		summaryElement.appendChild(removeButton);

		const ulElement = document.createElement("ul");

		for (const tag of tags) {
			const liElement = document.createElement("li");

			liElement.textContent = tag;

			const removeButton = document.createElement("button");
			removeButton.dataset.tagName = tag;
			removeButton.dataset.categoryName = category;
			removeButton.classList.add("remove-tag");
			removeButton.textContent = "თაგის წაშლა";

			liElement.appendChild(removeButton);

			ulElement.appendChild(liElement);
		}

		const liElement = document.createElement("li");
		const addButton = document.createElement("button");
		addButton.classList.add("new-tag");
		addButton.textContent = "ახალი თაგის დამატება";
		addButton.dataset.categoryName = category;
		liElement.appendChild(addButton);
		ulElement.appendChild(liElement);

		detailsElement.append(summaryElement, ulElement);

		listElement.appendChild(detailsElement);
	}
}

listElement.addEventListener("click", async ev => {
	const elt = ev.target as HTMLButtonElement;

	let isAButtonClick = false;
	if (elt.classList.contains("new-tag")) {
		const {categoryName} = elt.dataset;
		const tagName = prompt("ახალი თაგის სახელი")!;

		if ((await createTag(categoryName!, tagName)).ok) {
			data[categoryName!].push(tagName);
		}
		isAButtonClick = true;
	}
	if (elt.classList.contains("new-category")) {
		const categoryName = prompt("ახალი კატეგორიის სახელი")!;

		if ((await createCategory(categoryName)).ok) {
			data[categoryName!] = [];
		}
		isAButtonClick = true;
	}
	if (elt.classList.contains("remove-tag")) {
		const {categoryName, tagName} = elt.dataset;

		if ((await deleteTag(categoryName!, tagName!)).ok) {
			const ind = data[categoryName!].indexOf(tagName!);
			data[categoryName!].splice(ind, 1);
		}
		isAButtonClick = true;
	}
	if (elt.classList.contains("remove-category")) {
		const {categoryName} = elt.dataset;

		if ((await deleteCategory(categoryName!)).ok) {
			delete data[categoryName!];
		}
		isAButtonClick = true;
	}

	if (isAButtonClick) {
		renderData(data);

		ev.stopPropagation();
	}
})

let data: {[category: string]: string[]};

try {
	data = await getAvailableTags();
} catch (_e) {
	data = {
		კვლევა: ["PISA", "PIRLS"]
	}
}

renderData(data);
