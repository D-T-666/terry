import { getCurrentRealElement, getNewID } from "../element-manager.ts";
import { ElementAttributes } from "./index.ts";
import simpleRealElement from "./simple-real-element.ts";
// import MathJax from "@mathjax/src";

export function realElement(): HTMLElement {
	const id = getNewID();
	return simpleRealElement("formula", "span", id, `ფორმულა (${id})`);
}

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["content"] = i("formula-toolbar-content");

	toolbarElements["content"].addEventListener("keyup", () => {
		getCurrentRealElement()!.dataset.content = toolbarElements["content"].value;
		const math = MathJax.tex2mml(toolbarElements["content"].value);
		getCurrentRealElement()!.innerHTML = math;
		(getCurrentRealElement()!.firstChild as HTMLElement).setAttribute("display", "inline");
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
		"content": elt.dataset.content ?? ""
	};
};
