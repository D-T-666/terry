import { getNewID } from "../element-manager.ts";

export function realElement(): HTMLElement {
	const res = document.createElement('input');
	res.type = 'text';
	res.id = getNewID();
	res.dataset.name = `მოკლე პასუხი (${res.id})`;
	res.dataset.type = 'short-text-input';

	return res;
}

export const predecessors = [];
export const successors = [];
export const parents = [];
export const children = [];
