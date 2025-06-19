function simpleRealElement(type, tag, id, name) {
	if (name === undefined) { name = `${type}-${id}`; }

	const elt = document.createElement(tag);
	elt.id = id;
	elt.dataset.name = name;
	elt.dataset.type = type;

	return elt;
}

function realToInspector(elt) {
	const type = elt.dataset.type;

	if (type === undefined) return
	const id = elt.id;
	const name = elt.dataset.name;

	idCounter = Math.max(idCounter, Number(id) + 1);

	const children = [];
	for (const child of elt.children) {
		const childNode = realToInspector(child);
		if (childNode)
			children.push(childNode);
	}

	const res = createElementFromHTML(
		children.length === 0 ?
		`<div class="list" tabindex="0" data-id="${id}" data-type="${type}"><span data-type="${type}">${name}</span></div>` : 
		`<details open class="list" tabindex="0" data-id="${id}" data-type="${type}"><summary data-type="${type}">${name}</summary></details>`
	);

	for (const child of children) {
		res.appendChild(child);
	}

	return res;
}

const types = {
	"container": {
		allowedChildren: ["container", "paragraph", "table", "browser", "short-text-input", "multiple-choice-input"],
		realElement(id) { return simpleRealElement("container", "div", id) },
	},
	"paragraph": {
		allowedChildren: ["text", "formula"],
		realElement(id) { return simpleRealElement("paragraph", "p", id) },
	},
	"formula": {
		allowedChildren: [],
		realElement(id) { return simpleRealElement("formula", "span", id) },
	},
	"text": {
		allowedChildren: [],
		realElement(id) { return simpleRealElement("text", "span", id) },
	},
	"short-text-input": {
		allowedChildren: [],
		realElement(id) {
			return createElementFromHTML(`
				<input type="text" id="${id}" data-name="short-text-input-${id}" data-type="short-text-input">
			`)
		},
	},
	"multiple-choice-input": {
		allowedChildren: ["multiple-choice-item"],
		realElement(id) { return simpleRealElement("multiple-choice-input", "ol", id, `multipl-echoice-${id}`) },
	},
	"multiple-choice-item": {
		allowedChildren: ["container", "text", "formula", "image"],
		realElement(id) {
			const li = simpleRealElement("multiple-choice-item", "li", `${id}`, `item-${id}`);
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = id + 1;
			li.appendChild(checkbox)
			return li;
		}
	},
	"image": {},

	"browser-tab-container": {
		canBeRenamed: false,
		allowedChildren: ["browser-tab"]
	},
	"browser-content-container": {
		canBeRenamed: false,
		allowedChildren: ["browser-content"]
	},
	"browser-address-container": {
		canBeRenamed: false,
		allowedChildren: ["browser-address"]
	},

	"browser-tab": {
		allowedChildren: [],
		realElement(id) { return simpleRealElement("browser-tab", "button", id) },
	},
	"browser-content": { },
	"browser-address": { },

	"table": {
		allowedChildren: ["table-body", "table-head", "table-foot"],
		realElement(id) { return simpleRealElement("table", "table", id) }
	},
	"table-head": {
		allowedChildren: ["table-row"],
		realElement(id) { return simpleRealElement("table-head", "thead", id) }
	},
	"table-body": {
		allowedChildren: ["table-row"],
		realElement(id) { return simpleRealElement("table-body", "tbody", id) }
	},
	"table-foot": {
		allowedChildren: ["table-row"],
		realElement(id) { return simpleRealElement("table-foot", "tfoot", id) }
	},
	"table-row": {
		allowedChildren: ["table-data"],
		realElement(id) { return simpleRealElement("table-row", "tr", id, `row-${id}`) }
	},
	"table-data": {
		allowedChildren: ["container", "text", "formula", "browser", "short-text-input", "multiple-choice-input"],
		realElement(id) { return simpleRealElement("table-data", "td", id, `cell-${id}`) }
	},

	"browser": {
		allowedChildren: [],
		realElement(id) {
			let template = `
				<div data-type="browser" data-name="browser-${id}" id="${id}">
					<div data-type="browser-tab-container" data-name="tabs" id="${id}-tabs">
					</div>
					<div data-type="browser-address-container" data-name="addresses" id="${id}-addresses">
						<img src="assets/browser-controls.svg" height="20px"/>
					</div>
					<div data-type="browser-content-container" data-name="contents" id="${id}-content">
					</div>
				</div>
			`;
			return createElementFromHTML(template);
		},
	},
};


const element = {
	current: undefined,
	deselect() {
		if (this.current) {
			this.current.blur();
			this.current.removeAttribute("id");
		}
		this.current = undefined;
	},
	select(elt) {
		this.deselect();
		this.current = elt;
		this.current.setAttribute("id", "selected");
		this.type = elt.dataset
	}
}

const realElement = {
	current: undefined,
	deselect() {
		if (this.current)
			this.current.classList.remove("selected");
		this.current = undefined;
	},
	select(elt) {
		this.deselect();
		this.current = elt;
		this.current.classList.add("selected");
	}
}

function handleElementFocus(inspectorElement, event) {
	element.select(inspectorElement);

	const realElt = document.getElementById(inspectorElement.dataset.id);
	realElement.select(realElt);

	toolbars.show(realElt);
}

function addNewElement(type, parentElement, sibblingElement) {

}

