import { getNewID } from "../element-manager.ts";
import { registerEditor } from "../quill-manager.ts";
import simpleRealElement from "./simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	const res = simpleRealElement("text", "span", id, `ტექსტი (${id})`);

	return res;
}

export function mounted(elt: HTMLElement) {
	registerEditor(elt);
}
