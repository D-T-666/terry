import { getNewID } from "../element-manager.ts";
import simpleRealElement from "./simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	return simpleRealElement("container", "div", id, `კონტეინერი (${id})`);
}
