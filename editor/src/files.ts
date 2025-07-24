import { mainContent, treeView } from "./panels.ts";
import * as page from "./pages.ts"
import { getCurrentScheme } from "./grading.ts";
import { realToInspector } from "./elements.ts";
import { registerID } from "./element-manager.ts";

const testManager = {
	testName: undefined,
	// Returns an object containing the HTML as a string,
	// and the grading scheme (correct answers) as a string
	addInteraction(id) {
	},
	export() {
		const removeDynamicAttributes = (e) => {
			e.classList.remove("current");
			if (e.className === "") {
				e.removeAttribute("class")
			}

			for (const c of e.children) {
				removeDynamicAttributes(c);
			}
		};

		const elt = mainContent.cloneNode(true) as HTMLElement;
		removeDynamicAttributes(elt)

		const html = elt.innerHTML!.trim().replaceAll(/[\s\t][\s\t]+/g, '').replaceAll(' contenteditable="true"', '');

		const gradingScheme = getCurrentScheme();

		localStorage.setItem("test", JSON.stringify({html, gradingScheme}));

		return {html, gradingScheme};
	},
	load({ content, gradingScheme }: { content?: string, gradingScheme?: any }) {
		const obj = JSON.parse(window.localStorage.getItem("test")!);
		content = obj.html;
		gradingScheme = obj.gradingScheme;

		mainContent.innerHTML = content!;

		// Make spans and paragraphs contenteditable
		for (const paragraph of mainContent.getElementsByTagName('p')) {
			paragraph.contentEditable = 'true';
		}
		for (const span of mainContent.getElementsByTagName('span')) {
			span.contentEditable = 'true';
		}

		registerID(mainContent.firstChild as HTMLElement);

		// TODO: this is garbage, deal with it properly
		for (const id of Object.keys(gradingScheme)) {
			(document.getElementById(id)! as HTMLInputElement).value = gradingScheme[id].correct;
		}
		treeView.innerHTML = "";
		treeView.appendChild(realToInspector(mainContent.firstElementChild as HTMLElement));
		page.importElement(mainContent.firstElementChild as HTMLElement);
	},
	changeName(newName) {
	},
};

document.getElementById("load-test")!.addEventListener("click", (e) => {
	testManager.load({})
})

document.getElementById("save-test")!.addEventListener("click", (e) => {
	testManager.export()
})
