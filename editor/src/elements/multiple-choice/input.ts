import { getNewID } from "../../element-manager.ts";
import { ElementAttributes } from "../index.ts";
import simpleRealElement from "../simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();

	return simpleRealElement(
		"multipleChoiceInput",
		"ol",
		id,
		`მრავალარჩევნიანი პასუხი (${id})`,
	);
}

export const children = ["multipleChoiceItem"];

export function initializeToolbar() { }
export function showToolbar(_elt: HTMLElement) { }
export function attributes(_elt: HTMLElement): ElementAttributes {
	return { };
};
