import * as container from "../elements/container.ts";
import * as shortTextInput from "../elements/short-text-input.ts";
import * as paragraph from "../elements/paragraph.ts";

export function realElement(): HTMLElement {
	const res = container.realElement();
	res.appendChild(paragraph.realElement());
	res.appendChild(shortTextInput.realElement());

	return res;
}
