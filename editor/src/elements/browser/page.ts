import { getNewID } from "../../element-manager.ts";
import simpleRealElement from "../simple-real-element.ts";

export function realElement(): HTMLElement {
	const res = simpleRealElement("browserPage", "browser-page", getNewID());
	res.setAttribute("closable", "true");

	return res;
}

export const predecessors = [];
export const successors = [];
export const parents = [];
export const children = [];
