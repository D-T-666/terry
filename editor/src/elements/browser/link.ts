import { getCurrentRealElement, getNewID } from "../../element-manager.ts";
import { ElementAttributes } from "../index.ts";
import simpleRealElement from "../simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	return simpleRealElement("browserLink", "browser-link", id, `ბრაუზერის ლინკი (${id})`);
}

export const children = ["text", "image"];

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["browser"] = i("browserLink-toolbar-browser");
	toolbarElements["url"] = i("browserLink-toolbar-url");

	toolbarElements["browser"].addEventListener("change", () => {
		getCurrentRealElement()!.setAttribute("browser", toolbarElements["browser"].value);
	})
	toolbarElements["url"].addEventListener("change", () => {
		getCurrentRealElement()!.setAttribute("url", toolbarElements["url"].value);
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
		"browser": elt.getAttribute("browser") ?? "",
		"url": elt.getAttribute("to") ?? ""
	};
};
