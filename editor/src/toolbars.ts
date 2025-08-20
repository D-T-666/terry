import * as pages from './pages.ts'
import { mainContent, rightPane } from './panels.ts';
import { getCurrentRealElement } from './element-manager.ts';
import { types } from "./elements/index.ts";

const typeAttributes = {
	"general": [ "visibility-type", "visible-only-on", "visible-from", "visible-to" ],
};

const typeAttributeExtractors = {
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

			types[type].showToolbar(realElt);

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
}
initialize();
