import { getNewID } from "../element-manager.ts";

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
