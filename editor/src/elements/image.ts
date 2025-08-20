import { getCurrentRealElement, getNewID } from "../element-manager.ts";
import { ElementAttributes } from "./index.ts";
import simpleRealElement from "./simple-real-element.ts";
// import MathJax from "@mathjax/src";

export function realElement(): HTMLElement {
	const id = getNewID();
	return simpleRealElement("image", "img", id, `სურათი (${id})`);
}

const toolbarElements: {[name: string]: HTMLInputElement} = {};

const i = (id: string) => document.getElementById(id) as HTMLInputElement;
export function initializeToolbar() {
	toolbarElements["image"] = i("image-toolbar-image");
	toolbarElements["width"] = i("image-toolbar-width");
	toolbarElements["float"] = i("image-toolbar-float");

	toolbarElements["image"].addEventListener("change", (e: Event) => {
		console.log((e.target as HTMLInputElement).files)
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			(getCurrentRealElement() as HTMLImageElement).src = e.target!.result as string;
		}
		fileReader.readAsDataURL((e.target as HTMLInputElement).files![0]);
	});
	toolbarElements["width"].addEventListener("change", () => {
		getCurrentRealElement()!.style.width = `${toolbarElements["width"].value}px`;
	});
	toolbarElements["float"].addEventListener("change", () => {
		getCurrentRealElement()!.style.float = toolbarElements["float"].value;
	});
}

export function showToolbar(elt: HTMLElement) {
	const attrs = attributes(elt);
	for (const [key, value] of Object.entries(attrs)) {
		if (toolbarElements[key]) {
			toolbarElements[key].value = value;
		}
	}
}

export function attributes(elt: HTMLElement): ElementAttributes {
	return {
		"url": (elt as HTMLImageElement).src ?? "",
		"width": (elt.style.width ?? "100px").slice(0, -2),
		"float": elt.style.float ?? "left"
	};
};
