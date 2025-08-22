import { getCurrentRealElement, getNewID } from "../../element-manager.ts";
import { ElementAttributes } from "../index.ts";
import simpleRealElement from "../simple-real-element.ts";

export function realElement(): HTMLElement {
	const id = getNewID();

	return simpleRealElement(
		"singleChoiceInput",
		"ol",
		id,
		`ერთარჩევნიანი პასუხი (${id})`,
	);
}

export const children = ["singleChoiceItem"];


const toolbarElements: {[name: string]: HTMLInputElement} = {};

export function initializeToolbar() {
	toolbarElements["numbering"] = document.getElementById("singleChoiceInput-toolbar-numbering") as HTMLInputElement;

	toolbarElements["numbering"].addEventListener("change", () => {
		getCurrentRealElement()!.dataset.numbering = toolbarElements["numbering"].value;
	})
}

export function showToolbar(elt: HTMLElement) {
	const attrs = attributes(elt);
	for (const [key, value] of Object.entries(attrs)) {
		toolbarElements[key].value = value;
	}
}

export function attributes(elt: HTMLElement): ElementAttributes {
	return {
		"numbering": elt.dataset.numbering ?? "letters"
	};
};
