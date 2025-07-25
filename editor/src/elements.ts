import simpleRealElement from "./elements/simple-real-element.ts";
import { getNewID } from "./element-manager.ts";

export function realToInspector(elt: HTMLElement): HTMLElement | HTMLElement[] {
	const type = elt.dataset.type;

	const id = elt.id;
	const name = elt.dataset.name;

	const children: HTMLElement[] = [];
	for (const child of elt.children) {
		const childNode = realToInspector(child as HTMLElement);
		if (childNode) {
			if (childNode instanceof HTMLElement) {
				children.push(childNode);
			} else {
				children.push(...childNode);
			}
		}
	}

	if (type !== undefined) {
		const resDiv = document.createElement("div");
		resDiv.innerHTML =
			children.length === 0
				? `<div class="list" tabindex="0" data-id="${id}" data-type="${type}"><span data-type="${type}">${name}</span></div>`
				: `<details open class="list" tabindex="0" data-id="${id}" data-type="${type}"><summary data-type="${type}">${name}</summary></details>`;

		const res = resDiv.firstChild! as HTMLElement;

		for (const child of children) {
			res.appendChild(child);
		}

		return res;
	} else {
		return children;
	}
}

import * as container from "./elements/container.ts";
import * as paragraph from "./elements/paragraph.ts";
import * as formula from "./elements/formula.ts";
import * as text from "./elements/text.ts";
import * as shortTextInput from "./elements/short-text-input.ts";
import * as multipleChoiceInput from "./elements/multiple-choice-input.ts";
import * as multipleChoiceItem from "./elements/multiple-choice-item.ts";
import * as browserSim from "./elements/browser/sim.ts";
import * as browserPage from "./elements/browser/page.ts";
import * as browserLink from "./elements/browser/link.ts";

interface TerryElement {
	realElement: () => HTMLElement;
	mounted?: (elt: HTMLElement) => void;
	children: string[];
	successors?: string[];
	parents?: string[];
	predecessors?: string[];
}

export const types: {[name: string]: TerryElement} = {
	container, paragraph, formula, text, shortTextInput, multipleChoiceInput, multipleChoiceItem,
	browserSim, browserPage, browserLink,
	table: {
		children: ["table-body", "table-head", "table-foot"],
		realElement() {
			return simpleRealElement("table", "table", getNewID());
		},
	},
	"table-head": {
		children: ["table-row"],
		realElement() {
			return simpleRealElement("table-head", "thead", getNewID());
		},
	},
	"table-body": {
		children: ["table-row"],
		realElement() {
			return simpleRealElement("table-body", "tbody", getNewID());
		},
	},
	"table-foot": {
		children: ["table-row"],
		realElement() {
			return simpleRealElement("table-foot", "tfoot", getNewID());
		},
	},
	"table-row": {
		children: ["table-data"],
		realElement() {
			const id = getNewID();
			return simpleRealElement("table-row", "tr", id, `row-${id}`);
		},
	},
	"table-data": {
		children: [],
		realElement() {
			const id = getNewID();
			return simpleRealElement("table-data", "td", id, `cell-${id}`);
		},
	},
};
console.log(types);

// function addNewElement(type, parentElement, sibblingElement) {}
