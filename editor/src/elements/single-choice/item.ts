import { getNewID } from "../../element-manager.ts";

export function realElement(parentID?: string): HTMLElement {
	const res = document.createElement('li');
	res.dataset.type = 'singleChoiceItem';
	res.id = getNewID();
	res.dataset.name = `არჩევანი (${res.id})`;

	const radio = document.createElement('input');
	radio.type = 'radio';
	radio.id = getNewID();
	radio.name = parentID!;

	res.appendChild(radio);

	return res;
}

export const parents = ["singleChoiceInput"];

export function initializeToolbar() { }
export function showToolbar(_elt: HTMLElement) { }
export function attributes(_elt: HTMLElement): ElementAttributes {
	return { };
};
