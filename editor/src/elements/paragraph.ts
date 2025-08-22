import { getCurrentRealElement, getNewID } from "../element-manager.ts";
import { registerEditor } from "../quill-manager.ts";
import { ElementAttributes } from "./index.ts";
import simpleRealElement from "./simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	const res = simpleRealElement("paragraph", "p", id, `პარაგრაფი (${id})`);

	return res;
}

export function mounted(elt: HTMLElement) {
	registerEditor(elt);
}

export const children = ['text', 'formula'];

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["line-height"] = i("paragraph-toolbar-line-height");
	toolbarElements["first-line-indent"] = i("paragraph-toolbar-first-line-indent");
	toolbarElements["spacing-above"] = i("paragraph-toolbar-spacing-above");
	toolbarElements["spacing-below"] = i("paragraph-toolbar-spacing-below");
	toolbarElements["align"] = i("paragraph-toolbar-align");

	toolbarElements["line-height"].addEventListener("change", () => {
		getCurrentRealElement()!.style.lineHeight = toolbarElements["line-height"].value + "%";
	});
	toolbarElements["first-line-indent"].addEventListener("change", () => {
		getCurrentRealElement()!.style.textIndent = toolbarElements["first-line-indent"].value + "%";
	});
	toolbarElements["spacing-above"].addEventListener("change", () => {
		getCurrentRealElement()!.style.marginTop = toolbarElements["spacing-above"].value + "rem";
	});
	toolbarElements["spacing-below"].addEventListener("change", () => {
		getCurrentRealElement()!.style.marginBottom = toolbarElements["spacing-below"].value + "rem";
	});
	toolbarElements["align"].addEventListener("change", () => {
		getCurrentRealElement()!.style.textAlign = toolbarElements["align"].value;
	});
}

export function showToolbar(elt: HTMLElement) {
	const attrs = attributes(elt);
	for (const [key, value] of Object.entries(attrs)) {
		toolbarElements[key].value = value;
	}
}

export function attributes(elt: HTMLElement): ElementAttributes {
	return {
		"line-height": (elt.style.lineHeight ?? "%").slice(0, -1),
		"first-line-indent": (elt.style.lineHeight ?? "%").slice(0, -1),
		"spacing-above": (elt.style.marginTop ?? "rem").slice(0, -2),
		"spacing-below": (elt.style.marginBottom ?? "rem").slice(0, -2),
		"align": elt.style.textAlign ?? "left"
	};
};
