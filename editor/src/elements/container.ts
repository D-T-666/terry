import { getCurrentRealElement, getNewID } from "../element-manager.ts";
import { ElementAttributes } from "./index.ts";
import simpleRealElement from "./simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	return simpleRealElement("container", "div", id, `კონტეინერი (${id})`);
}

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["layout"] = i("container-toolbar-layout");
	toolbarElements["padding"] = i("container-toolbar-padding");
	toolbarElements["border"] = i("container-toolbar-border");
	toolbarElements["align"] = i("container-toolbar-align");

	toolbarElements["layout"].addEventListener("change", () => {
		getCurrentRealElement()!.dataset.layout = toolbarElements["layout"].value;
	});
	toolbarElements["padding"].addEventListener("change", () => {
		getCurrentRealElement()!.style.padding = toolbarElements["padding"].value + "px";
	});
	toolbarElements["border"].addEventListener("change", () => {
		getCurrentRealElement()!.dataset.border = toolbarElements["border"].value;
	});
	toolbarElements["align"].addEventListener("change", () => {
		getCurrentRealElement()!.dataset.align = toolbarElements["align"].value;
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
		"layout": elt.dataset.layout ?? "",
		"padding": (elt.style.padding ?? "0  ").slice(0, -2),
		"border": elt.dataset.border ?? "",
		"align": elt.dataset.align ?? ""
	};
};
