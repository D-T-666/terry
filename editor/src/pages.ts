import { mainContent } from './panels.ts';

const pageButtonsDiv = document.getElementById("page-buttons")!;
const addPageButton = document.getElementById("add-page")!;

export let current = 0;
let total = 0;
let pageElements: HTMLElement[][] = [];
let pageButtonElements: HTMLElement[] = [];

export function addPage() {
	const innerElt = document.createElement('input');
	innerElt.type = 'radio';
	innerElt.id = `page-${total + 1}`;
	innerElt.name = 'current-page';

	const newPageIndex = total;
	innerElt.addEventListener("change", () => {
		showPage(newPageIndex);
	})
	const label = document.createElement('label');
	label.innerText = String(total + 1);

	label.appendChild(innerElt);
	pageButtonsDiv.insertBefore(label, addPageButton);
	pageButtonElements.push(label);
	pageElements.push([]);
	total += 1;
	(mainContent.firstElementChild! as HTMLElement).dataset.pages = String(total);
}

export function hidePage() {
	for (const elt of pageElements[current]) {
		elt.classList.remove("current")
	}
}

export function showPage(i: number) {
	if (!(i < total && i >= 0)) {
		return;
	}

	console.log(pageElements[i])
	hidePage();
	current = i;
	for (const elt of pageElements[current]) {
		elt.classList.add("current");
	}
}

export function importElement(elt: HTMLElement) {
	const visibilityType = elt.dataset.visibilityType ?? "always";

	switch (visibilityType ) {
		case "only": {
			const ind = Number(elt.dataset.visibleOnlyOn ?? "1")
			while (ind > total) {
				addPage();
			}
			trackElementOnly(elt, ind);
			break;
		}
		case "range": {
			const l = Number(elt.dataset.visibleFrom ?? "1");
			const r = Number(elt.dataset.visibleTo ?? "1");
			while (l > total) {
				addPage();
			}
			while (r > total) {
				addPage();
			}
			trackElementRange(elt, l, r);
			break;
		}
	}

	for (const child of elt.children) {
		importElement(child as HTMLElement);
	}

	cleanUpUnusedPages();
}

export function untrackElementOutside(elt: HTMLElement, l: number, r: number) {
	for (let i = 0; i < total; i++) {
		if (i < l || i > r) {
			const ind = pageElements[i].indexOf(elt);
			if (ind >= 0) {
				pageElements[i].splice(ind, 1);
			}
		}
	}
}

function cleanUpUnusedPages() {
	for (let i = total - 1; i > 0; i--) {
		if (pageElements[i].length > 0) {
			break;
		}

		pageElements.pop();
		pageButtonElements.pop()!.remove();
		total--;
	}
}

export function trackElementOnly(elt: HTMLElement, i: number, untrack: boolean = true) {
	i -= 1;
	if (!(i < total && i >= 0)) {
		return;
	}

	if (!pageElements[i].includes(elt)) {
		pageElements[i].push(elt);
	}

	if (untrack) {
		untrackElementOutside(elt, i, i);
	}

	if (i === current) {
		showPage(i);
	}
}

export function trackElementRange(elt: HTMLElement, l: number, r: number) {
	for (let i = l; i <= r; i++) {
		trackElementOnly(elt, i, false);
	}

	untrackElementOutside(elt, l - 1, r - 1);
}


addPageButton.addEventListener("click", () => {
	addPage();
})
