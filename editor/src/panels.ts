import { copyBuffer } from "../script.ts";
import { deselectElement, getCurrentElement, handleElementFocus, selectElement } from "./element-manager.ts";
import { updateTest } from "./files.ts";
import { Menu, openMenuWithOptions } from "./menus.ts";

export const treeView = document.getElementById("tree-view")!
export const mainContent = document.getElementById("main-content")!;
export const rightPane = document.getElementById("right-pane")!;

let shouldToggle = false;
treeView.addEventListener("click", (e) => {
	if (getCurrentElement() === undefined) return;
	if (!getCurrentElement()!.contains(e.target as Node)) {
		deselectElement();
	}
	if (!shouldToggle) {
		e.preventDefault();
	}
	shouldToggle = true;
}, true);

treeView.addEventListener("contextmenu", (e) => {
	const etarget = e.target as HTMLElement;
	e.preventDefault();
	if (etarget.classList.contains("list"))
		selectElement(etarget);
	else if (etarget.parentElement!.classList.contains("list"))
		selectElement(etarget.parentElement!);
	else
		return;
	e.stopPropagation();
	const options = ['rcm-add-child', 'rcm-add-preset', 'rcm-copy', 'rcm-delete', 'rcm-rename'];
	if (etarget.parentElement!.parentElement!.parentElement!.classList.contains("list") || etarget.parentElement!.parentElement!.classList.contains("list")) {
		options.push('rcm-add-sibbling');
	}
	if (copyBuffer.isCopying()) {
		options.push('rcm-paste-child');

		if (etarget.parentElement?.classList.contains("list")) {
			options.push('rcm-paste-above');
		}
	}
	openMenuWithOptions(Menu.rightClick, options, etarget);
}, true);

treeView.addEventListener("focus", (e: Event) => {
	let elt = e.target as HTMLElement;

	if (!elt.classList.contains("list"))
		elt = elt.parentElement!;

	if (!elt.classList.contains("list"))
		return;

	handleElementFocus(elt);
	shouldToggle = false;
}, true);

rightPane.addEventListener("change", () => {
	updateTest();
})
