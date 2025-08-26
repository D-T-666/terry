import { getCurrentElement, getCurrentRealElement, getNewID, selectRealElement } from "../element-manager.ts";
import { ElementAttributes } from "./index.ts";
import simpleRealElement from "./simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	return simpleRealElement("heading", "h1", id, `სათაური (${id})`);
}

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["level"] = i("heading-toolbar-level");
	toolbarElements["content"] = i("heading-toolbar-content");
	toolbarElements["align"] = i("heading-toolbar-align");

	toolbarElements["content"].addEventListener("keyup", () => {
		getCurrentRealElement()!.innerText = toolbarElements["content"].value;

		let newName = "(H) " + toolbarElements["content"].value.slice(0, 20);
		if (toolbarElements["content"].value.length > 20) {
			newName += "...";
		}

		getCurrentRealElement()!.dataset.name = newName;
		(getCurrentElement()!.firstChild as HTMLElement).innerText = newName;
	}, false);
	toolbarElements["level"].addEventListener("change", () => {
		const elt = getCurrentRealElement()!;

		const newElt = document.createElement(`h${toolbarElements["level"].value}`);
		newElt.id = elt.id;
		newElt.textContent = elt.textContent;
		newElt.style.textAlign = elt.style.textAlign;
		newElt.dataset.type = elt.dataset.type;
		newElt.dataset.name = elt.dataset.name;

		elt.replaceWith(newElt);
		selectRealElement(newElt);
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
		"content": elt.innerText,
		"level": elt.tagName.slice(1),
		"align": elt.style.textAlign ?? "center"
	};
};
