import { getNewID } from "../element-manager.ts";

export function realElement(): HTMLElement {
	const res = document.createElement('li');
	res.dataset.type = 'multiple-choice-item';
	res.id = getNewID();
	res.dataset.name = `არჩევანი (${res.id})`;

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = getNewID();

	res.appendChild(checkbox);

	return res;
}

export const predecessors = [];
export const successors = [];
export const parents = [];
export const children = ["multiple-choice-item"];
