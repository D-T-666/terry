import { getCurrentRealElement, getNewID } from "../element-manager.ts";
import { ElementAttributes } from "./index.ts";

export function realElement(): HTMLElement {
	const res = document.createElement('textarea');
	res.id = getNewID();
	res.dataset.name = `გრძელი პასუხი (${res.id})`;
	res.dataset.type = 'longTextInput';

	return res;
}

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["width"] = i("longTextInput-toolbar-width");

	toolbarElements["width"].addEventListener("change", () => {
		(getCurrentRealElement() as HTMLTextAreaElement).cols = Number(toolbarElements["width"].value);
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
		"width": String((elt as HTMLTextAreaElement).cols)
	};
};
