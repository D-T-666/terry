function min(a, b) {
	return a < b ? a : b;
}

export function renderTestListing({ id, name, description, tags }) {
	// Create the main details element
	const details = document.createElement("details");
	details.setAttribute("name", "test");
	details.dataset.id = id;

	// Create the summary element
	const summary = document.createElement("summary");

	// Create title span
	const titleSpan = document.createElement("span");
	titleSpan.className = "title";
	titleSpan.textContent = name;
	summary.appendChild(titleSpan);

	const all_tags = [];
	for (const key of Object.keys(tags)) {
		all_tags.push(...tags[key]);
	}

	// Create tags ul
	if (all_tags.length > 0) {
		const tagsUl = document.createElement("ul");
		tagsUl.className = "tags";

		for (let i = 0; i < min(all_tags.length, 5); i++) {
			const li = document.createElement("li");
			li.setAttribute("t", all_tags[i]);
			tagsUl.appendChild(li);
		}

		summary.appendChild(tagsUl);
	}

	// Create button
	const button = document.createElement("button");
	button.classList.add("open");
	button.textContent = "გახსნა";
	summary.appendChild(button);

	details.appendChild(summary);

	// Create description div
	if (description) {
		const descriptionDiv = document.createElement("div");
		descriptionDiv.className = "description";
		descriptionDiv.textContent = description;
		details.appendChild(descriptionDiv);
	}

	// Create attributes ul
	if (all_tags.length > 0) {
		const attributesUl = document.createElement("ul");
		attributesUl.className = "attributes";

		for (const category of Object.keys(tags)) {
			const li = document.createElement("li");

			// Add label text
			li.appendChild(document.createTextNode(category + ":"));

			// Create nested tags ul
			if (tags[category] && tags[category].length > 0) {
				const nestedTagsUl = document.createElement("ul");
				nestedTagsUl.className = "tags";

				tags[category].forEach((tag) => {
					const tagLi = document.createElement("li");
					tagLi.setAttribute("t", tag);
					nestedTagsUl.appendChild(tagLi);
				});

				li.appendChild(nestedTagsUl);
			}

			attributesUl.appendChild(li);
		}

		details.appendChild(attributesUl);
	}

	return details;
}
