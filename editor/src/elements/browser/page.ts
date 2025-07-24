import { getNewID } from "../../element-manager.ts";
import simpleRealElement from "../simple-real-element.ts";

export function realElement(): HTMLElement {
	return simpleRealElement("browserPage", "browser-page", getNewID());
}

export const predecessors = [];
export const successors = [];
export const parents = [];
export const children = [];
