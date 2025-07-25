import { hideMenus, Menu, openMenuWithOptions } from './src/menus.ts';
import { mainContent, treeView } from './src/panels.ts';
import { cloneUnique, deselectElement, getCurrentElement, getCurrentRealElement, getNewID, handleElementFocus, selectElement } from './src/element-manager.ts';
import { availableElements, realToInspector, types } from './src/elements.ts';
import { addPage } from './src/pages.ts';
import './src/files.ts';

let activeAction: undefined | ((elt: HTMLElement, type: string) => void) = undefined;
let copyBuffer: undefined | HTMLElement = undefined;

function initialize() {
	const type = "container";

	const elt = types[type].realElement();
	mainContent.appendChild(elt);
	treeView.appendChild(realToInspector(elt));

	// To prevent single clicks from folding the elements
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
		const options = ['rcm-add-child', 'rcm-add-sibbling', 'rcm-copy', 'rcm-delete', 'rcm-rename'];
		if (copyBuffer !== undefined) {
			options.push('rcm-paste-child')
			options.push('rcm-paste-above')
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
	}, true)

	document.getElementById("rcm-add-child")!.addEventListener("click", (e) => {
		activeAction = addAChild;
		openMenuWithOptions(Menu.element, availableElements(getCurrentElement()!), e.target as HTMLElement);
	}, false);

	document.getElementById("rcm-add-sibbling")!.addEventListener("click", (e) => {
		activeAction = addASibbling;
		openMenuWithOptions(Menu.element, availableElements(getCurrentElement()!.parentElement!), e.target as HTMLElement);
	}, false);

	document.getElementById("rcm-copy")!.addEventListener("click", (e) => {
		let dataId = getCurrentElement()!.dataset.id!;
		copyBuffer = document.getElementById(dataId)!;
		hideMenus();
	}, false);

	document.getElementById("rcm-paste-child")!.addEventListener("click", (e) => {
		const elt = cloneUnique(copyBuffer!);
		getCurrentRealElement()!.appendChild(elt);
		getCurrentElement()!.parentElement!.replaceChild(realToInspector(getCurrentRealElement()!), getCurrentElement()!);
		hideMenus();
	}, false);

	document.getElementById("rcm-paste-above")!.addEventListener("click", (e) => {
		const elt = cloneUnique(copyBuffer!);
		getCurrentRealElement()!.parentElement!.insertBefore(elt, getCurrentRealElement()!);
		const parentInspectorElement = realToInspector(getCurrentRealElement()!.parentElement!);
		getCurrentElement()!.parentElement!.parentElement!.replaceChild(parentInspectorElement, getCurrentElement()!.parentElement!);
		hideMenus()
	}, false);

	document.getElementById("rcm-delete")!.addEventListener("click", (e) => {
		let dataId = getCurrentElement()!.dataset.id!;
		getCurrentElement()!.remove();
		deselectElement();
		document.getElementById(dataId)!.remove();
		hideMenus();
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
	}, false);

	for (const type of Object.keys(types)) {
		const elt = document.getElementById(type);
		if (elt) {
			elt.addEventListener("click", (e) => {
				activeAction!(getCurrentElement(), type);
				deselectElement();
			});
		}
	}

	addPage();
}
initialize();

function createElementFromHTML(htmlString) {
	const div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild;
}

function addAChild(target: HTMLElement, type: string) {
	const parentId = target.dataset.id!;
	const parentElement_real = document.getElementById(parentId)!;

	const elt_real = types[type].realElement();

	parentElement_real.appendChild(elt_real);

	if (types[type].mounted)
		types[type].mounted(elt_real);

	target.parentElement!.replaceChild(realToInspector(parentElement_real), target);
}

function addASibbling(target: HTMLElement, type: string) {
	const siblingId = target.dataset.id!;
	const siblingElement = document.getElementById(siblingId)!;
	const parentElement = siblingElement.parentElement!;

	const elt_real = types[type].realElement();

	parentElement.insertBefore(elt_real, siblingElement);

	if (types[type].mounted)
		types[type].mounted(elt_real);

	target.parentElement!.insertBefore(realToInspector(elt_real), target);
}
