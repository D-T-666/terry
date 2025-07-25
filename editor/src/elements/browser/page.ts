import { getNewID } from "../../element-manager.ts";
import simpleRealElement from "../simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();
	const res = simpleRealElement("browserPage", "browser-page", id, `გვერდი (${id})`);
	res.setAttribute("closable", "true");

	return res;
}

export const predecessors = [];
export const successors = [];
export const parents = [];
export const children = [];
