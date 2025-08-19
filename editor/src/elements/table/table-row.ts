import { getNewID } from "../../element-manager.ts";
import simpleRealElement from "../simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();

	return simpleRealElement(
		"table-row",
		"tr",
		id,
		`სტრიქონი (${id})`,
	);
}

export const children = [];

