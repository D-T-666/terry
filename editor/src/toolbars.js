const typeAttributes = {
	"text": [ "content", "color", "bold", "italic", "underline", "size", ],
	"paragraph": [ "line-height", "first-line-indent", "spacing-above", "spacing-below", ],
	"container": [ "layout", "padding", "border", "align" ],
	"browser-tab": [ "name" ],
	"formula": [ "content" ],
	"short-text-input": [ "width" ],
	"table": [ "style" ],
	"general": [ "visibility-type", "visible-only-on", "visible-from", "visible-to" ],
};

const typeAttributeExtractors = {
	"text": (elt) => ({
		"content": elt.innerText,
		"color": elt.style.color,
		"bold": elt.style.fontWeight == "bold",
		"italic": elt.style.fontStyle == "oblique",
		"underline": elt.style.textDecoration == "underline",
		"size": elt.style.fontSize.slice(0, -2)
	}),
	"paragraph": (elt) => ({
		"line-height": elt.style.lineHeight.slice(0, -1),
		"first-line-indent": elt.style.lineHeight.slice(0, -1),
		"spacing-above": elt.style.marginTop.slice(0, -2),
		"spacing-below": elt.style.marginBottom.slice(0, -2)
	}),
	"container": (elt) => ({
		"layout": elt.dataset.layout,
		"padding": elt.style.padding.slice(0, -2),
		"border": elt.dataset.border,
		"align": elt.dataset.align
	}),
	"formula": (elt) => ({
		"content": elt.dataset.content
	}),
	"short-text-input": (elt) => ({
		"width": elt.style.width.slice(0, -2)
	}),
	"browser-tab": (elt) => ({
		"name": elt.innerText
	}),
	"table": (elt) => ({
		"style": elt.dataset.style || "empty"
	}),
	"general": (elt) => {
		const res = {
			"visibility-type": elt.dataset.visibilityType || "always",
		};
		switch (res["visibility-type"]) {
			case "only":
				res["visible-only-on"] = elt.dataset.visibleOnlyOn || "1";
				break;
			case "range":
				res["visible-from"] = elt.dataset.visibleFrom || "1";
				res["visible-to"] = elt.dataset.visibleTo || "1";
				break;
		}
		return res;
	}
};

const toolbarOf = {};

for (const t of Object.keys(typeAttributes)) {
	const obj = {};
	for (const c of typeAttributes[t]) {
		const elt = document.getElementById(`${t}-toolbar-${c}`);
		obj[c] = {
			element: elt,
			addEventListener: elt.addEventListener,
			set value(value) {
				if (elt.nodeName === "INPUT") 
					switch (elt.type) {
						case "text":
						case "number":
							elt.value = value;
							break;
						case "checkbox":
							elt.checked = value;
					}
				if (elt.nodeName === "SELECT" || elt.nodeName === "TEXTAREA")
					elt.value = value;
				this.setTrigger(value);
			},
			setTrigger(value) { },
		};
	}
	toolbarOf[t] = obj;
}

const toolbars = {
	_elements: {},
	_current: undefined,
	show(realElt) {
		if (this._current) {
			this._current.classList.remove("current");
		}

		const type = realElt.dataset.type;
		if (this._elements[type] === undefined) {
			this._elements[type] = document.getElementById(`${type}-toolbar`);
		}
		this._current = this._elements[type];

		if (this._current) {
			this._current.classList.add("current");

			const attributes = typeAttributeExtractors[type](realElt);
			for (const attr of Object.keys(attributes)) {
				toolbarOf[type][attr].value = attributes[attr];
			}

			const generalAttributes = typeAttributeExtractors["general"](realElt);
			for (const attr of Object.keys(generalAttributes)) {
				toolbarOf["general"][attr].value = generalAttributes[attr];
			}
		}
	},
	hide() {
		if (this._current) {
			this._current.classlist.remove("current");
			this._current = undefined;
		}
	}
}

function initialize() {
	toolbarOf["general"]["visibility-type"].setTrigger = (value) => {
		rightPane.dataset.visibilityType = value;
	};

	toolbarOf["general"]["visibility-type"].element.addEventListener("change", (e) => {
		toolbarOf["general"]["visibility-type"].setTrigger(e.target.value);
		realElement.current.dataset.visibilityType = e.target.value;
	});

	toolbarOf["general"]["visible-only-on"].element.addEventListener("change", (e) => {
		realElement.current.dataset.visibleOnlyOn = e.target.value;
		page.importElement(realElement.current);
	});
	toolbarOf["general"]["visible-from"].element.addEventListener("change", (e) => {
		realElement.current.dataset.visibleFrom = e.target.value;
		page.importElement(realElement.current);
	});
	toolbarOf["general"]["visible-to"].element.addEventListener("change", (e) => {
		realElement.current.dataset.visibleTo = e.target.value;
		page.importElement(realElement.current);
	});


	// "table-toolbar"
	toolbarOf["table"]["style"].element.addEventListener("change", (e) => {
		realElement.current.dataset.style = e.target.value;
	})

	// "short-text-input-toolbar"
	toolbarOf["short-text-input"]["width"].element.addEventListener("change", (e) => {
		realElement.current.style.width = e.target.value + "ch";
	});

	// "formula-toolbar"
	toolbarOf["formula"]["content"].element.addEventListener("keyup", (e) => {
		realElement.current.dataset.content = e.target.value;
		const math = MathJax.tex2mml(e.target.value);
		realElement.current.innerHTML = math;
		realElement.current.firstChild.setAttribute("display", "inline");
	});

	// "browser-tab-toolbar"
	toolbarOf["browser-tab"]["name"].element.addEventListener("keyup", (e) => {
		realElement.current.innerText = e.target.value;
	});

	// "paragraph-toolbar"
	toolbarOf["paragraph"]["line-height"].element.addEventListener("change", (e) => {
		realElement.current.style.lineHeight = e.target.value + "%";
	});
	toolbarOf["paragraph"]["first-line-indent"].element.addEventListener("change", (e) => {
		realElement.current.style.textIndent = e.target.value + "%";
	});
	toolbarOf["paragraph"]["spacing-above"].element.addEventListener("change", (e) => {
		realElement.current.style.marginTop = e.target.value + "rem";
	});
	toolbarOf["paragraph"]["spacing-below"].element.addEventListener("change", (e) => {
		realElement.current.style.marginBottom = e.target.value + "rem";
	});

	// "container-toolbar"
	toolbarOf["container"]["layout"].element.addEventListener("change", (e) => {
		realElement.current.dataset.layout = e.target.value;
	});
	toolbarOf["container"]["padding"].element.addEventListener("change", (e) => {
		realElement.current.style.padding = e.target.value + "px";
	});
	toolbarOf["container"]["border"].element.addEventListener("change", (e) => {
		realElement.current.dataset.border = e.target.value;
	});
	toolbarOf["container"]["align"].element.addEventListener("change", (e) => {
		realElement.current.dataset.align = e.target.value;
	});
	
	// "text-toolbar"
	toolbarOf["text"]["content"].element.addEventListener("keyup", (e) => {
		realElement.current.innerText = e.target.value;
	}, false);
	toolbarOf["text"]["color"].element.addEventListener("change", (e) => {
		realElement.current.style.color = e.target.value;
	}, false);
	toolbarOf["text"]["bold"].element.addEventListener("change", (e) => {
		realElement.current.style.fontWeight = e.target.checked ? "bold" : "normal";
	}, false);
	toolbarOf["text"]["italic"].element.addEventListener("change", (e) => {
		realElement.current.style.fontStyle = e.target.checked ? "oblique" : "normal";
	}, false);
	toolbarOf["text"]["underline"].element.addEventListener("change", (e) => {
		realElement.current.style.textDecoration = e.target.checked ? "underline" : "none";
	}, false);
	toolbarOf["text"]["size"].element.addEventListener("change", (e) => {
		realElement.current.style.fontSize = e.target.value + "px";
	}, false);
}
initialize();
