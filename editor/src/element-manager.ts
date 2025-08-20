import { realToInspector } from "./elements/index.ts";
import { treeView } from "./panels.ts";
import { toolbars } from "./toolbars.ts";

let idCounter: number = 0;

export function getNewID(): string {
	return String(idCounter++);
}

export function registerID(elt: Element) {
	const eltId = Number(elt.id);
	if (eltId >= idCounter) idCounter = eltId + 1;

	for (const child of elt.children) {
		registerID(child)
	}
}

export function cloneUnique(elt: Element): Element {
	const res = elt.cloneNode(true) as Element;

	function updateIDs(elt: Element) {
		elt.id = getNewID();

		for (const child of elt.children) {
			updateIDs(child);
		}
	}

	updateIDs(res);

	return res;
}

// INSPECTOR ELEMENT

let selectedElement: HTMLElement | undefined = undefined;
// let selectedType

export function getCurrentElement(): HTMLElement | undefined {
	return selectedElement;
}

export function deselectElement() {
	deselectRealElement();
	if (selectedElement) {
		selectedElement.blur();
		selectedElement.removeAttribute("id");
	}
	selectedElement = undefined;
}

export function selectElement(elt: HTMLElement) {
		deselectElement();
		selectedElement = elt;
		selectedElement.setAttribute("id", "selected");

		const realElt = document.getElementById(elt.dataset.id!)!;
		selectRealElement(realElt);
		toolbars.show(realElt);
		// type = elt.dataset;
}

export function handleElementFocus(inspectorElement: HTMLElement) {
	selectElement(inspectorElement);
}

export function updateInspector(realElt: HTMLElement) {
	const id = realElt.id;

	const elt = treeView.querySelector(`[data-id="${id}"]`) as HTMLElement;

	elt.parentElement!.replaceChild(realToInspector(realElt) as Node, elt);
}

// REAL ELEMENT

let selectedRealElement: HTMLElement | undefined = undefined;

export function getCurrentRealElement(): HTMLElement | undefined {
	return selectedRealElement;
}

function deselectRealElement() {
	if (selectedRealElement) selectedRealElement.classList.remove("selected");
	selectedRealElement = undefined;
}

export function selectRealElement(elt: HTMLElement) {
	deselectRealElement();
	selectedRealElement = elt;
	selectedRealElement.classList.add('selected');
}
