import { getCurrentRealElement, getNewID } from "../element-manager.ts";
import { ElementAttributes } from "./index.ts";

export function realElement(): HTMLElement {
	const res = document.createElement('input');
	res.type = 'text';
	res.id = getNewID();
	res.dataset.name = `მოკლე პასუხი (${res.id})`;
	res.dataset.type = 'shortTextInput';

	return res;
}

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["width"] = i("shortTextInput-toolbar-width");

	toolbarElements["width"].addEventListener("change", () => {
		getCurrentRealElement()!.style.width = toolbarElements["width"].value + "ch";
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
		"width": elt.style.width.slice(0, -2)
	};
};
