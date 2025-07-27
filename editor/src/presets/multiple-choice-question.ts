import { registerEditor } from "../quill-manager.ts";
import * as container from "../elements/container.ts";
import * as multipleChoiceInput from "../elements/multiple-choice-input.ts";
import * as multipleChoiceItem from "../elements/multiple-choice-item.ts";
import * as paragraph from "../elements/paragraph.ts";

export function realElement(): HTMLElement {
	const res = container.realElement();
	res.appendChild(paragraph.realElement());
	const input = multipleChoiceInput.realElement();
	input.appendChild(multipleChoiceItem.realElement());
	input.appendChild(multipleChoiceItem.realElement());
	input.appendChild(multipleChoiceItem.realElement());

	res.appendChild(input);

	return res;
}

export function mounted(elt: HTMLElement) {
	registerEditor(elt);
}

export const children = ['text', 'formula'];
