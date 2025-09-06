import { getCurrentRealElement, getNewID } from "../element-manager.ts";
import { ElementAttributes } from "./index.ts";
import simpleRealElement from "./simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();

	const res = simpleRealElement(
		"multiColumn",
		"div",
		id,
		`მრავალსვეტიანი კონტეინერი`,
	);

	return res;
}

export const children = ["container"];

const toolbarElements: {[name: string]: HTMLInputElement} = {};

export function initializeToolbar() {
	toolbarElements["height"] = document.getElementById("multiColumn-toolbar-height") as HTMLInputElement;

	toolbarElements["height"].addEventListener("change", () => {
		getCurrentRealElement()!.style.height = (Number(toolbarElements["height"].value) * 0.8) + "vh";
	})
}

export function showToolbar(elt: HTMLElement) {
	const attrs = attributes(elt);
	for (const [key, value] of Object.entries(attrs)) {
		toolbarElements[key].value = value;
	}
}

export function attributes(elt: HTMLElement): ElementAttributes {
	return {
		"height": (elt.style.height ?? "80vh").slice(0, -2)
	};
};
