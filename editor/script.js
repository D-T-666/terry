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


function initialize() {
	const id = ("" + (idCounter++)).padStart(3, "0");
	const type = "container";

	const elt = types[type].realElement(id);
	mainContent.appendChild(elt);
	treeView.appendChild(realToInspector(elt));

	treeView.addEventListener("click", (e) => {
		if (element.current === undefined) return;
		if (!element.current.contains(e.target)) {
			element.deselect();
		}
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

function addAChild(target, type) {
	const parentId = target.dataset.id;
	const id = ("" + (idCounter++)).padStart(3, "0");

	const elt = types[type].realElement(id, parentId);

	const inspectorElt = realToInspector(elt);
	target.appendChild(inspectorElt);
	document.getElementById(parentId).appendChild(elt);
}

function addASibbling(target, type) {
	const siblingId = target.dataset.id;
	const siblingElement = document.getElementById(siblingId);
	const parentId = siblingElement.parentElement.id;

	const id = ("" + (idCounter++)).padStart(3, "0");
	const elt = types[type].realElement(id, parentId);

	target.parentElement.insertBefore(realToInspector(elt), target);
	te.parentElement.insertBefore(elt, siblingElement);
}
