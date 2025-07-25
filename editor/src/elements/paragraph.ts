import { getNewID } from "../element-manager.ts";
import { registerEditor } from "../quill-manager.ts";
import simpleRealElement from "./simple-real-element.ts";

export function realElement(): HTMLElement {
	const res = simpleRealElement("paragraph", "p", getNewID());

	return res;
}

export function mounted(elt: HTMLElement) {
	registerEditor(elt);
}

export const predecessors = [];
export const successors = [];
export const parents = [];
export const children = ['text', 'formula'];
