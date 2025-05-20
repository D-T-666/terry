let treeView = document.getElementById("tree-view");
let mainContent = document.getElementById("main-content");
let rightPane = document.getElementById("right-pane");

document.addEventListener("click", function (e) {
	if (!rightClickMenu.contains(e.target)) {
		rightClickMenu.style.visibility = "hidden";
		elementMenu.style.visibility = "hidden";
	}
});

let idCounter = 0;

let activeType = undefined;
let activeAction = undefined;
let copyBuffer = undefined;

function initialize() {
	const id = ("" + (idCounter++)).padStart(3, "0");
	const type = "container";

	const elt = types[type].realElement(id);
	mainContent.appendChild(elt);
	treeView.appendChild(realToInspector(elt));

	// To prevent single clicks from folding the elements
	let shouldToggle = false;
	treeView.addEventListener("click", (e) => {
		if (element.current === undefined) return;
		if (!element.current.contains(e.target)) {
			element.deselect();
		}
		if (!shouldToggle) {
			e.preventDefault();
		}
		shouldToggle = true;
	}, true);

	treeView.addEventListener("contextmenu", (e) => {
		if (e.target.classList.contains("list"))
			element.select(e.target);
		else if (e.target.parentElement.classList.contains("list"))
			element.select(e.target.parentElement);
		else
			return;
		e.stopPropagation();
		openMenu(rightClickMenu, e);
	}, true);

	treeView.addEventListener("focus", (e) => {
		let elt;
		if (e.target.classList.contains("list"))
			elt = e.target;
		else if (e.target.parentElement.classList.contains("list"))
			elt = e.target.parentElement;
		else
			return;
		handleElementFocus(elt, e);
		shouldToggle = false;
	}, true)
	
	document.getElementById("rcm-add-child").addEventListener("click", (e) => {
		activeAction = addAChild;
		const options = types[element.current.dataset.type].allowedChildren;
		openMenuWithOptions(elementMenu, options, e);
	}, false);

	document.getElementById("rcm-add-sibbling").addEventListener("click", (e) => {
		activeAction = addASibbling;
		const options = types[element.current.parentElement.dataset.type].allowedChildren;
		openMenuWithOptions(elementMenu, options, e);
	}, false);

	document.getElementById("rcm-copy").addEventListener("click", (e) => {
		let dataId = element.current.dataset.id;
		copyBuffer = document.getElementById(dataId);
	}, false);

	document.getElementById("rcm-paste-child").addEventListener("click", (e) => {
		const elt = cloneUnique(copyBuffer);
		realElement.current.appendChild(elt);
		element.current.appendChild(realToInspector(elt));
	}, false);

	document.getElementById("rcm-paste-above").addEventListener("click", (e) => {
		const elt = cloneUnique(copyBuffer);
		realElement.current.parentElement.insertBefore(elt, realElement.current);
		const parentInspectorElement = realToInspector(realElement.current.parentElement);
		element.current.parentElement.parentElement.replaceChild(parentInspectorElement, element.current.parentElement);
	}, false);

	document.getElementById("rcm-delete").addEventListener("click", (e) => {
		let dataId = element.current.dataset.id;
		element.current.remove();
		element.deselect();
		document.getElementById(dataId).remove();
		rightClickMenu.style.visibility = "hidden";
	}, false);

	document.getElementById("rcm-rename").addEventListener("click", (e) => {
		let dataId = element.current.dataset.id;

		const oldSpan = element.current.firstChild;
	 	const spanContent = oldSpan.innerText;

		const newTextInput = document.createElement("input");
		newTextInput.type = "text";
		newTextInput.value = spanContent;

		element.current.insertBefore(newTextInput, oldSpan);
		oldSpan.remove();
		newTextInput.focus();
		newTextInput.addEventListener("blur", (e) => {
			if (!newTextInput.contains(e.relatedTarget)) {
				oldSpan.innerText = newTextInput.value;
				document.getElementById(dataId).dataset.name = newTextInput.value;
				element.current.insertBefore(oldSpan, newTextInput);
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
				activeAction(element.current, type);
				element.deselect();
			});
		}
	}
}
initialize();

function createElementFromHTML(htmlString) {
	const div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild;
}

function cloneUnique(elt) {
	const res = elt.cloneNode(true);
	
	function updateIDs(elt) {
		elt.id = ("" + (idCounter++)).padStart(3, "0");
		elt.dataset.name += " (1)";

		for (const child of elt.children) {
			updateIDs(child);
		}
	}

	updateIDs(res);

	return res;
}

function addAChild(target, type) {
	const parentId = target.dataset.id;
	const parentElement = document.getElementById(parentId);

	const id = ("" + (idCounter++)).padStart(3, "0");

	const elt = types[type].realElement(id, parentId);

	parentElement.appendChild(elt);

	const inspectorElt = realToInspector(parentElement);
	target.parentElement.replaceChild(inspectorElt, target);
}

function addASibbling(target, type) {
	const siblingId = target.dataset.id;
	const siblingElement = document.getElementById(siblingId);
	const parentElement = siblingElement.parentElement;
	const parentId = parentElement.id;

	const id = ("" + (idCounter++)).padStart(3, "0");
	const elt = types[type].realElement(id, parentId);

	target.parentElement.insertBefore(realToInspector(elt), target);
	parentElement.insertBefore(elt, siblingElement);
}
