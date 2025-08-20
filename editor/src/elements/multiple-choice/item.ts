import { getNewID } from "../../element-manager.ts";
import { ElementAttributes } from "../index.ts";

export function realElement(): HTMLElement {
	const res = document.createElement('li');
	res.dataset.type = 'multipleChoiceItem';
	res.id = getNewID();
	res.dataset.name = `არჩევანი (${res.id})`;

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = getNewID();

	res.appendChild(checkbox);

	return res;
}

export const parents = ["multipleChoiceInput"];

export function initializeToolbar() { }
export function showToolbar(_elt: HTMLElement) { }
export function attributes(_elt: HTMLElement): ElementAttributes {
	return { };
};
