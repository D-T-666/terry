import { getCurrentRealElement, getNewID } from "../../element-manager.ts";
import { mainContent } from "../../panels.ts";
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
	const urls: string[] = [];
	const browsers: {[name: string]: string} = {};

	function traverse(elt: HTMLElement) {
		if (elt.tagName === "BROWSER-SIM") {
			browsers[elt.dataset.name!] = elt.id;
		}
		if (elt.tagName === "BROWSER-PAGE") {
			urls.push(elt.getAttribute("url")!);
		}
		for (const c of elt.children) {
			traverse(c as HTMLElement);
		}
	}
	traverse(mainContent as HTMLElement);

	toolbarElements["url"].innerHTML = "";
	toolbarElements["browser"].innerHTML = "";

	for (const url of urls) {
		const elt = document.createElement("option");
		elt.value = url;
		elt.innerText = url;
		toolbarElements["url"].appendChild(elt);
	}

	for (const key of Object.keys(browsers)) {
		const elt = document.createElement("option");
		elt.value = browsers[key];
		elt.innerText = key;
		toolbarElements["browser"].appendChild(elt);
	}

	const attrs = attributes(elt);
	for (const [key, value] of Object.entries(attrs)) {
		toolbarElements[key].value = value;
	}
}

export function attributes(elt: HTMLElement): ElementAttributes {
	return {
		"browser": elt.getAttribute("browser") ?? "",
		"url": elt.getAttribute("url") ?? ""
	};
};
