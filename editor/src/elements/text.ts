import { getCurrentElement, getCurrentRealElement, getNewID } from "../element-manager.ts";
import { registerEditor } from "../quill-manager.ts";
import { ElementAttributes } from "./index.ts";
import simpleRealElement from "./simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	const res = simpleRealElement("text", "span", id, `ტექსტი (${id})`);

	return res;
}

export function mounted(elt: HTMLElement) {
	registerEditor(elt);
}

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["content"] = i("text-toolbar-content");
	toolbarElements["color"] = i("text-toolbar-color");
	toolbarElements["bold"] = i("text-toolbar-bold");
	toolbarElements["italic"] = i("text-toolbar-italic");
	toolbarElements["underline"] = i("text-toolbar-underline");
	toolbarElements["size"] = i("text-toolbar-size");

	console.log("but whyyyy")

	toolbarElements["content"].addEventListener("keyup", () => {
		getCurrentRealElement()!.innerText = toolbarElements["content"].value;

		let newName = "(T) " + toolbarElements["content"].value.slice(0, 20);
		if (toolbarElements["content"].value.length > 20) {
			newName += "...";
		}

		getCurrentRealElement()!.dataset.name = newName;
		(getCurrentElement()!.firstChild as HTMLElement).innerText = newName;
	}, false);
	toolbarElements["color"].addEventListener("change", () => {
		getCurrentRealElement()!.style.color = toolbarElements["color"].value;
	}, false);
	toolbarElements["bold"].addEventListener("change", () => {
		getCurrentRealElement()!.style.fontWeight = toolbarElements["bold"].checked ? "bold" : "normal";
	}, false);
	toolbarElements["italic"].addEventListener("change", () => {
		getCurrentRealElement()!.style.fontStyle = toolbarElements["italic"].checked ? "oblique" : "normal";
	}, false);
	toolbarElements["underline"].addEventListener("change", () => {
		getCurrentRealElement()!.style.textDecoration = toolbarElements["underline"].checked ? "underline" : "none";
	}, false);
	toolbarElements["size"].addEventListener("change", () => {
		getCurrentRealElement()!.style.fontSize = toolbarElements["size"].value + "pt";
	}, false);
}

export function showToolbar(elt: HTMLElement) {
	const attrs = attributes(elt);
	console.log(attrs, toolbarElements);
	for (const [key, value] of Object.entries(attrs)) {
		toolbarElements[key].value = value;
	}
}

export function attributes(elt: HTMLElement): ElementAttributes {
	return {
		"content": elt.innerText,
		"color": elt.style.color ?? "black",
		"bold": String(elt.style.fontWeight === "bold"),
		"italic": String(elt.style.fontStyle === "oblique"),
		"underline": String(elt.style.textDecoration === "underline"),
		"size": (elt.style.fontSize ?? "12pt").slice(0, -2)
	};
};
