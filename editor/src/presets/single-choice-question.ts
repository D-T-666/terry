import * as container from "../elements/container.ts";
import * as singleChoiceInput from "../elements/single-choice/input.ts";
import * as singleChoiceItem from "../elements/single-choice/item.ts";
import * as paragraph from "../elements/paragraph.ts";
import * as text from "../elements/text.ts";

function item(parentId: string) {
	const res = singleChoiceItem.realElement(parentId);
	const t = text.realElement();
	res.append(t);
	t.innerText = " abc ";

	return res;
}

export function realElement(): HTMLElement {
	const res = container.realElement();
	res.appendChild(paragraph.realElement());
	const input = singleChoiceInput.realElement();
	input.appendChild(item(input.id));
	input.appendChild(item(input.id));
	input.appendChild(item(input.id));

	res.appendChild(input);

	return res;
}
