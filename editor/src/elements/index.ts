import simpleRealElement from "./simple-real-element.ts";
import { getNewID } from "../element-manager.ts";

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

import * as container from "./container.ts";
import * as paragraph from "./paragraph.ts";
import * as formula from "./formula.ts";
import * as text from "./text.ts";
import * as heading from "./heading.ts";
import * as shortTextInput from "./short-text-input.ts";
import * as longTextInput from "./long-text-input.ts";
import * as multipleChoiceInput from "./multiple-choice/input.ts";
import * as multipleChoiceItem from "./multiple-choice/item.ts";
import * as singleChoiceInput from "./single-choice/input.ts";
import * as singleChoiceItem from "./single-choice/item.ts";
import * as browserSim from "./browser/sim.ts";
import * as browserPage from "./browser/page.ts";
import * as browserLink from "./browser/link.ts";
import * as table from "./table/table.ts";
import * as tableRow from "./table/table-row.ts";
import * as tableElement from "./table/table-element.ts";
import * as image from "./image.ts";
import * as multiColumn from "./multi-column.ts";

export type ElementAttributes = {[name: string]: string};

interface TerryElement {
	realElement: (parentID?: string) => HTMLElement;
	attributes: (elt: HTMLElement) => ElementAttributes;
	initializeToolbar: () => void;
	showToolbar: (elt: HTMLElement) => void;
	mounted?: (elt: HTMLElement) => void;
	children?: string[];
	parents?: string[];
}

export const types: {[name: string]: TerryElement} = {
	container, paragraph, formula, text, shortTextInput,
	multipleChoiceInput, multipleChoiceItem, singleChoiceInput,
	singleChoiceItem, browserSim, browserPage, browserLink, table,
	tableRow, tableElement, image, longTextInput, heading, multiColumn
};

export function initializeToolbars() {
	for (const {initializeToolbar} of Object.values(types)) {
		if (initializeToolbar)
			initializeToolbar();
	}
}

export function availableElements(parent: HTMLElement): string[] {
	const res = [];

	for (const type of Object.keys(types)) {
		let valid = true;

		if (types[parent.dataset.type!].children !== undefined) {
			valid &&= types[parent.dataset.type!].children!.includes(type);
		}

		if (types[type].parents !== undefined) {
			valid &&= types[type].parents!.includes(parent.dataset.type!);
		}

		if (valid) {
			res.push(type);
		}
	}

	return res;
}

// function addNewElement(type, parentElement, sibblingElement) {}
