import { getCurrentRealElement, getNewID, updateInspector, cloneUnique } from "../../element-manager.ts";
import { ElementAttributes } from "../index.ts";
import simpleRealElement from "../simple-real-element.ts";

import { realElement as tableRow } from "./table-row.ts";
import { realElement as tableElement } from "./table-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();

	const res = simpleRealElement(
		"table",
		"table",
		id,
		`ცხრილი (${id})`,
	);

	res.appendChild(tableRow());
	res.lastChild!.appendChild(tableElement());

	return res;
}

export const children = [];

function resizeTableRows(elt: HTMLElement, rows: number) {
	const oldRows = elt.children.length;

	if (oldRows < rows) {
		for (let i = 0; i < rows - oldRows; i++) {
			const newRow = cloneUnique(elt.lastChild as HTMLElement);
			elt.appendChild(newRow as HTMLElement);
		}
	} else if (oldRows > rows) {
		while (elt.children.length > rows) {
			elt.lastChild!.remove();
		}
	}

	elt.dataset.rows = String(rows);

	updateInspector(elt);
}

function resizeTableCols(elt: HTMLElement, cols: number) {
	const oldCols = (elt.firstChild as HTMLElement).children.length;

	for (const row of elt.children) {
		if (oldCols < cols) {
			for (let i = 0; i < cols - oldCols; i++) {
				row.appendChild(tableElement());
			}
		} else {
			while (row.children.length) {
				row.lastChild!.remove();
			}
		}
	}

	elt.dataset.cols = String(cols);

	updateInspector(elt);
}

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["style"] = i("table-toolbar-style");
	toolbarElements["rows"] = i("table-toolbar-rows");
	toolbarElements["cols"] = i("table-toolbar-cols");

	toolbarElements["style"].addEventListener("change", () => {
		getCurrentRealElement()!.dataset.style = toolbarElements["style"].value;
	});
	toolbarElements["rows"].addEventListener("change", () => {
		const elt = getCurrentRealElement()!;
		resizeTableRows(elt, Number(toolbarElements["rows"].value));
	});
	toolbarElements["cols"].addEventListener("change", () => {
		const elt = getCurrentRealElement()!;
		resizeTableCols(elt, Number(toolbarElements["cols"].value));
	});
}

export function showToolbar(elt: HTMLElement) {
	const attrs = attributes(elt);
	console.log(toolbarElements, attrs);
	for (const [key, value] of Object.entries(attrs)) {
		toolbarElements[key].value = value;
	}
}

export function attributes(elt: HTMLElement): ElementAttributes {
	return {
		"style": elt.dataset.style || "basic",
		"rows": elt.dataset.rows || "1",
		"cols": elt.dataset.cols || "1",
	};
};
