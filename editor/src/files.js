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

		const elt = mainContent.cloneNode(true);
		removeDynamicAttributes(elt)

		const html = elt.innerHTML.trim().replace(/[\s\t][\s\t]+/g, '');

		const gradingScheme = grading.getScheme();

		localStorage.setItem("test", JSON.stringify({html, gradingScheme}));

		return {html, gradingScheme};
	},
	load({content, gradingScheme}) {
		content = JSON.parse(window.localStorage.getItem("test")).html;
		mainContent.innerHTML = content;
		treeView.innerHTML = "";
		treeView.appendChild(realToInspector(mainContent.firstElementChild));
		page.importElement(mainContent.firstElementChild);
	},
	changeName(newName) {
	},
};

document.getElementById("load-test").addEventListener("click", (e) => {
	testManager.load({
		// content: prompt("the html, please")
	})
})

document.getElementById("save-test").addEventListener("click", (e) => {
	testManager.export()
})
