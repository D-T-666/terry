import * as pages from './pages.ts'
import { mainContent, rightPane } from './panels.ts';
import { getCurrentRealElement } from './element-manager.ts';

const typeAttributes = {
	"text": [ "content", "color", "bold", "italic", "underline", "size", ],
	"paragraph": [ "line-height", "first-line-indent", "spacing-above", "spacing-below", ],
	"container": [ "layout", "padding", "border", "align" ],
	"browserPage": [ "closable", "title", "url" ],
	"browserLink": [ "browser", "url" ],
	"formula": [ "content" ],
	"shortTextInput": [ "width" ],
	"table": [ "style" ],
	"general": [ "visibility-type", "visible-only-on", "visible-from", "visible-to" ],
};

const typeAttributeExtractors = {
	"text": (elt: HTMLElement) => ({
		"content": elt.innerText,
		"color": elt.style.color || "black",
		"bold": elt.style.fontWeight === "bold",
		"italic": elt.style.fontStyle === "oblique",
		"underline": elt.style.textDecoration === "underline",
		"size": (elt.style.fontSize || "12pt").slice(0, -2)
	}),
	"paragraph": (elt: HTMLElement) => ({
		"line-height": elt.style.lineHeight.slice(0, -1),
		"first-line-indent": elt.style.lineHeight.slice(0, -1),
		"spacing-above": elt.style.marginTop.slice(0, -2),
		"spacing-below": elt.style.marginBottom.slice(0, -2)
	}),
	"container": (elt: HTMLElement) => ({
		"layout": elt.dataset.layout,
		"padding": elt.style.padding.slice(0, -2),
		"border": elt.dataset.border,
		"align": elt.dataset.align
	}),
	"formula": (elt: HTMLElement) => ({
		"content": elt.dataset.content
	}),
	"shortTextInput": (elt: HTMLElement) => ({
		"width": elt.style.width.slice(0, -2)
	}),
	"browserLink": (elt: HTMLElement) => ({
		"browser": elt.getAttribute("browser"),
		"url": elt.getAttribute("to")
	}),
	"browserPage": (elt: HTMLElement) => ({
		"closable": elt.getAttribute("closable") ,
		"title": elt.getAttribute("title"),
		"url": elt.getAttribute("url")
	}),
	"table": (elt: HTMLElement) => ({
		"style": elt.dataset.style || "empty"
	}),
	"general": (elt: HTMLElement) => {
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

const toolbarOf: {[name: string]: any} = {};

for (const t of Object.keys(typeAttributes)) {
	const obj = {};
	for (const c of typeAttributes[t]) {
		const elt = document.getElementById(`${t}-toolbar-${c}`)!;
		console.log(t, c);
		obj[c] = {
			element: elt,
			addEventListener: elt.addEventListener,
			set value(value) {
				if (elt.nodeName === "INPUT") {
					const inputElt = elt as HTMLInputElement;
					switch (inputElt.type) {
						case "text":
						case "number":
							inputElt.value = value;
							break;
						case "checkbox":
							inputElt.checked = value;
					}
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

export const toolbars = {
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

		if (type === "browserLink") {
			const urls: string[] = [];
			const browsers = {};

			function traverse(elt) {
				if (elt.tagName === "BROWSER-SIM") {
					browsers[elt.dataset.name] = elt.id;
				}
				if (elt.tagName === "BROWSER-PAGE") {
					urls.push(elt.getAttribute("url"));
				}
				for (const c of elt.children) {
					traverse(c);
				}
			}
			traverse(mainContent);

			toolbarOf["browserLink"]["url"].element.innerHTML = "";
			toolbarOf["browserLink"]["browser"].element.innerHTML = "";

			for (const url of urls) {
				const elt = document.createElement("option");
				elt.value = url;
				elt.innerText = url;
				toolbarOf["browserLink"]["url"].element.appendChild(elt);
			}

			for (const key of Object.keys(browsers)) {
				const elt = document.createElement("option");
				elt.value = browsers[key];
				elt.innerText = key;
				toolbarOf["browserLink"]["browser"].element.appendChild(elt);
			}
		}

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
		getCurrentRealElement()!.dataset.visibilityType = e.target.value;
	});

	toolbarOf["general"]["visible-only-on"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.dataset.visibleOnlyOn = e.target.value;
		pages.importElement(getCurrentRealElement()!);
	});
	toolbarOf["general"]["visible-from"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.dataset.visibleFrom = e.target.value;
		pages.importElement(getCurrentRealElement()!);
	});
	toolbarOf["general"]["visible-to"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.dataset.visibleTo = e.target.value;
		pages.importElement(getCurrentRealElement()!);
	});


	// "table-toolbar"
	toolbarOf["table"]["style"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.dataset.style = e.target.value;
	})

	// "shortTextInput-toolbar"
	toolbarOf["shortTextInput"]["width"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.width = e.target.value + "ch";
	});

	// "formula-toolbar"
	toolbarOf["formula"]["content"].element.addEventListener("keyup", (e) => {
		getCurrentRealElement()!.dataset.content = e.target.value;
		const math = MathJax.tex2mml(e.target.value);
		getCurrentRealElement()!.innerHTML = math;
		(getCurrentRealElement()!.firstChild as HTMLElement).setAttribute("display", "inline");
	});

	// // "browser-tab-toolbar"
	// toolbarOf["browser-tab"]["name"].element.addEventListener("keyup", (e) => {
	// 	getCurrentRealElement()!.innerText = e.target.value;
	// });

	// "browserLink-toolbar"
	toolbarOf["browserLink"]["browser"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.setAttribute("browser", e.target.value);
	})
	toolbarOf["browserLink"]["url"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.setAttribute("to", e.target.value);
	})

	// "browserPage-toolbar"
	toolbarOf["browserPage"]["closable"].element.addEventListener("change", (e: Event) => {
		getCurrentRealElement()!.setAttribute("closable", String((e.target! as HTMLInputElement).checked));
	})
	toolbarOf["browserPage"]["title"].element.addEventListener("keyup", (e) => {
		getCurrentRealElement()!.setAttribute("title", e.target.value);
	})
	toolbarOf["browserPage"]["url"].element.addEventListener("keyup", (e) => {
		getCurrentRealElement()!.setAttribute("url", e.target.value);
	})

	// "paragraph-toolbar"
	toolbarOf["paragraph"]["line-height"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.lineHeight = e.target.value + "%";
	});
	toolbarOf["paragraph"]["first-line-indent"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.textIndent = e.target.value + "%";
	});
	toolbarOf["paragraph"]["spacing-above"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.marginTop = e.target.value + "rem";
	});
	toolbarOf["paragraph"]["spacing-below"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.marginBottom = e.target.value + "rem";
	});

	// "container-toolbar"
	toolbarOf["container"]["layout"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.dataset.layout = e.target.value;
	});
	toolbarOf["container"]["padding"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.padding = e.target.value + "px";
	});
	toolbarOf["container"]["border"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.dataset.border = e.target.value;
	});
	toolbarOf["container"]["align"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.dataset.align = e.target.value;
	});

	// "text-toolbar"
	toolbarOf["text"]["content"].element.addEventListener("keyup", (e) => {
		getCurrentRealElement()!.innerText = e.target.value;
	}, false);
	toolbarOf["text"]["color"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.color = e.target.value;
	}, false);
	toolbarOf["text"]["bold"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.fontWeight = e.target.checked ? "bold" : "normal";
	}, false);
	toolbarOf["text"]["italic"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.fontStyle = e.target.checked ? "oblique" : "normal";
	}, false);
	toolbarOf["text"]["underline"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.textDecoration = e.target.checked ? "underline" : "none";
	}, false);
	toolbarOf["text"]["size"].element.addEventListener("change", (e) => {
		getCurrentRealElement()!.style.fontSize = e.target.value + "pt";
	}, false);
}
initialize();
