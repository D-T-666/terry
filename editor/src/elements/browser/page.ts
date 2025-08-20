import { getCurrentRealElement, getNewID } from "../../element-manager.ts";
import { ElementAttributes } from "../index.ts";
import simpleRealElement from "../simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	const res = simpleRealElement("browserPage", "browser-page", id, `გვერდი (${id})`);
	res.setAttribute("closable", "true");

	return res;
}

export const parents = ["browserSim"];

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["closable"] = i("browserPage-toolbar-closable");
	toolbarElements["title"] = i("browserPage-toolbar-title");
	toolbarElements["url"] = i("browserPage-toolbar-url");

	toolbarElements["closable"].addEventListener("change", () => {
		getCurrentRealElement()!.setAttribute("closable", String(toolbarElements["closable"].checked));
	})
	toolbarElements["title"].addEventListener("keyup", () => {
		getCurrentRealElement()!.setAttribute("title", toolbarElements["title"].value);
	})
	toolbarElements["url"].addEventListener("keyup", () => {
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
		"closable": elt.getAttribute("closable") ?? "true",
		"title": elt.getAttribute("title") ?? "",
		"url": elt.getAttribute("url") ?? elt.id
	};
};
