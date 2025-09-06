import { hideMenus, Menu, openMenuWithOptions } from './src/menus.ts';
import './src/panels.ts';
import { cloneUnique, deselectElement, getCurrentElement, getCurrentRealElement, getNewID, handleElementFocus, selectElement } from './src/element-manager.ts';
import { initializeToolbars, availableElements, realToInspector, types } from './src/elements/index.ts';
import './src/files.ts';
import { availablePresets, presets } from "./src/presets/index.ts";

import "../styles.css";
import "../player.css";
import "./style.css";
import { CopyBuffer } from "./src/copy-buffer.ts";
import { updateTest } from "./src/files.ts";

let activeAction: undefined | ((elt: HTMLElement, type: string) => void) = undefined;

export const copyBuffer = new CopyBuffer<HTMLElement>();

function initialize() {
	// To prevent single clicks from folding the elements
	document.getElementById("rcm-add-child")!.addEventListener("click", (e) => {
		activeAction = addAChild;
		openMenuWithOptions(Menu.element, availableElements(getCurrentElement()!), e.target as HTMLElement);
	}, false);

	document.getElementById("rcm-add-sibbling")!.addEventListener("click", (e) => {
		activeAction = addASibbling;
		openMenuWithOptions(Menu.element, availableElements(getCurrentElement()!.parentElement!), e.target as HTMLElement);
	}, false);

	document.getElementById("rcm-add-preset")!.addEventListener("click", (e) => {
		activeAction = addAPreset;
		openMenuWithOptions(Menu.preset, availablePresets(), e.target as HTMLElement);
	}, false);

	document.getElementById("rcm-copy")!.addEventListener("click", (e) => {
		let dataId = getCurrentElement()!.dataset.id!;
		copyBuffer.data = document.getElementById(dataId)!;
		hideMenus();
	}, false);

	document.getElementById("rcm-paste-child")!.addEventListener("click", (e) => {
		const elt = cloneUnique(copyBuffer.data!);
		getCurrentRealElement()!.appendChild(elt);
		getCurrentElement()!.parentElement!.replaceChild(realToInspector(getCurrentRealElement()!) as Node, getCurrentElement()!);
		hideMenus();
		updateTest();
	}, false);

	document.getElementById("rcm-paste-above")!.addEventListener("click", (e) => {
		const elt = cloneUnique(copyBuffer.data!);
		getCurrentRealElement()!.parentElement!.insertBefore(elt, getCurrentRealElement()!);
		const parentInspectorElement = realToInspector(getCurrentRealElement()!.parentElement!);
		getCurrentElement()!.parentElement!.parentElement!.replaceChild(parentInspectorElement as Node, getCurrentElement()!.parentElement!);
		hideMenus();
		updateTest();
	}, false);

	document.getElementById("rcm-delete")!.addEventListener("click", (e) => {
		let dataId = getCurrentElement()!.dataset.id!;
		getCurrentElement()!.remove();
		deselectElement();
		document.getElementById(dataId)!.remove();
		hideMenus();
		updateTest();
	}, false);

	document.getElementById("rcm-rename")!.addEventListener("click", (e) => {
		let dataId = getCurrentElement()!.dataset.id!;

		const oldSpan = getCurrentElement()!.firstChild! as HTMLElement;
	 	const spanContent = oldSpan.innerText;

		const newTextInput = document.createElement("input");
		newTextInput.type = "text";
		newTextInput.value = spanContent;

		getCurrentElement()!.insertBefore(newTextInput, oldSpan);
		oldSpan.remove();
		newTextInput.focus();
		newTextInput.addEventListener("blur", (e) => {
			if (!newTextInput.contains(e.relatedTarget as Node)) {
				oldSpan.innerText = newTextInput.value;
				document.getElementById(dataId)!.dataset.name = newTextInput.value;
				getCurrentElement()!.insertBefore(oldSpan, newTextInput);
				newTextInput.remove();
			}
		});
		newTextInput.addEventListener("click", (e) => {
			e.stopPropagation();
		});
		newTextInput.addEventListener("keyup", (e) => {
			if (e.key === "Enter" || e.key === "Escape") {
				newTextInput.blur();
			}
		});
		oldSpan.remove();
		updateTest();
	}, false);

	for (const type of Object.keys(types)) {
		const elt = document.getElementById(type);
		if (elt) {
			elt.addEventListener("click", () => {
				activeAction!(getCurrentElement()!, type);
				deselectElement();
				hideMenus();
			});
		}
	}

	for (const preset of Object.keys(presets)) {
		const elt = document.getElementById(preset);
		if (elt) {
			elt.addEventListener("click", () => {
				activeAction!(getCurrentElement()!, preset);
				deselectElement();
				hideMenus();
			});
		}
	}

	initializeToolbars();
}
initialize();

function addAChild(target: HTMLElement, type: string) {
	const parentId = target.dataset.id!;
	const parentElement_real = document.getElementById(parentId)!;

	const elt_real = types[type].realElement(parentId);

	parentElement_real.appendChild(elt_real);

	if (types[type].mounted !== undefined)
		types[type].mounted(elt_real);

	target.appendChild(realToInspector(elt_real) as Node);

	if (target.tagName === "DIV") {
		const newTarget = document.createElement("details");
		newTarget.classList.add("list");
		newTarget.tabIndex = 0;
		newTarget.dataset.id = parentId;
		newTarget.dataset.type = target.dataset.type;
		newTarget.open = true;

		const summary = document.createElement("summary");
		summary.dataset.type = target.dataset.type;
		summary.innerText = (target.firstChild as HTMLElement).innerText;

		newTarget.appendChild(summary);

		const children = [...target.children].slice(1);
		newTarget.append(...children);

		target.replaceWith(newTarget);
	}

	updateTest();
}

function addASibbling(target: HTMLElement, type: string) {
	const siblingId = target.dataset.id!;
	const siblingElement = document.getElementById(siblingId)!;
	const parentElement = siblingElement.parentElement!;
	const parentId = target.parentElement!.id;

	const elt_real = types[type].realElement(parentId);

	parentElement.insertBefore(elt_real, siblingElement);

	if (types[type].mounted !== undefined)
		types[type].mounted(elt_real);

	target.parentElement!.insertBefore(realToInspector(elt_real) as Node, target);
	updateTest();
}

function addAPreset(target: HTMLElement, preset: string) {
	const parentId = target.dataset.id!;
	const parentElement_real = document.getElementById(parentId)!;

	const elt_real = presets[preset].realElement();

	parentElement_real.appendChild(elt_real);

	if (presets[preset].mounted !== undefined)
		presets[preset].mounted(elt_real);

	target.parentElement!.replaceChild(realToInspector(parentElement_real) as Node, target);
	updateTest();
}
